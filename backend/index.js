// Import necessary modules
import express from "express";
import cors from "cors";
import "dotenv/config"
import { getSpeakingData } from "./utils/generateAudio.js";
import { generateResponse } from "./utils/generateResponse.js";
import expressWs from "express-ws";
import { TranscriptionService } from "./service/TranscribtionService.js";
import router from "./route.js";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";


//connect to db
mongoose.connect(process.env.DB_URL).then(() => console.log("DB connected")).catch(() => console.log("Error while connecting DB."))

// Initialize Express app
const app = express();
const port = 4000;
expressWs(app);


// Middleware
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
})); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.static("audios")); // Serve static files from the "audios" directory
app.use(cookieParser())
//check
app.get("/", (req, res) => {
    res.status(200).send("Server is in working...");
})
// Chat route
app.use("/api/v1",router);

// WebSocket route
app.ws("/transcribtion", async (connection, req) => {
    console.log("WebSocket connection opened");
    const config = {
        stopStream: false,
        assistantSpeaking: false,
    }

    let transcriptionService;
    try {
        
    transcriptionService = new TranscriptionService(handleIntrupt);
    } catch (error) {
        console.log("error")
    }

    const chat_context = [
        // {
        //     role: "system",
        //     content: `You are a compassionate and highly knowledgeable medical doctor with years of experience in general medicine. Your role is to interact with patients, answer their health-related questions in clear and professional language, and provide safe, evidence-based guidance.
        //     🧑‍⚕️ Tone: Empathetic, clear, calm, and professional  
        //     📚 Knowledge: Based on WHO, CDC, NHS, Mayo Clinic, PubMed  
        //     🚫 Disclaimer: Always include a reminder that your response is not a substitute for in-person consultation, diagnosis, or emergency care.
        //     Respond directly, like you're speaking kindly to the patient. Don't include headings like "Patient's Question" or "Doctor's Response".`,
        // }
    ]

    // Handle incoming messages from Twilio
    connection.on('message', async (message) => {
        try {

            const data = JSON.parse(message);
            switch (data.event) {
                case 'start':
                    console.log(data)
                    chat_context.push({
                        role: "user",
                        content: `I am ${data.start?.name}. I am suffering from ${data.start?.diseases}, and ${data.start?.description}.`
                    });

                    chat_context.push({
                        role: "assistant",
                        content: `Okay!`
                    });

                    console.log('Starting transcription...');
                    break;
                case 'media':
                    transcriptionService.send(data.media.payload);
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error, 'Message:', message);
        }
    });

    function handleIntrupt() {
        config.stopStream = true;
        connection.send(
            JSON.stringify({
                event: 'clear',
            })
        );
    }

   

   
    
    
  

    transcriptionService.on('transcription', async (transcript_text) => {
        if (!transcript_text) return
        console.log('User', transcript_text);

        if (transcript_text) {
            config.stopStream = true;
            connection.send(
                JSON.stringify({
                    event: 'transcript',
                    transcript: {
                        value: transcript_text
                    }
                })
            );
        }

        if (transcript_text) {
            config.stopStream = true;
            connection.send(
                JSON.stringify({
                    event: 'clear',
                })
            );
        }

        connection.send(
            JSON.stringify({
                event: 'state',
                state: {
                    value: "Thinking..."
                }
            })
        );


        //send  response to assistant
        try {
            console.log('genrating response...');
            chat_context.push({
                role: "user",
                content: transcript_text
            })

            console.log(chat_context)
            const text = await generateResponse(chat_context);
            chat_context.push({
                role: "assistant",
                content: text
            })

            console.log("Bot: ",text);
            const audio = await getSpeakingData(text);
            console.log("response send successfully");
            connection.send(
            JSON.stringify({
                event: 'audio',
                audio: {...audio, transcription: text}
            }))
        } catch (error) {
            console.log(error.message)
            
        }
    })




    // Handle connection close and log transcript
    connection.on('close', async () => {
        console.log(`Client disconnected`);
        transcriptionService.close();
    });

});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});