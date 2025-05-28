// Import necessary modules
import express from "express";
import cors from "cors";
import "dotenv/config"
import { getSpeakingData } from "./utils/generateAudio.js";
import { generateResponse } from "./utils/generateResponse.js";
import expressWs from "express-ws";
import { TranscriptionService } from "./service/TranscribtionService.js";

// Initialize Express app
const app = express();
const port = 4000;
expressWs(app);


// Middleware
app.use(cors({
    origin: "*"
})); // Enable CORS
app.use(express.json()); // Parse JSON request bodies
app.use(express.static("audios")); // Serve static files from the "audios" directory

//check
app.get("/", (req, res) => {
    res.status(200).send("Server is in working...");
})
// Chat route
app.get("/chat", async (req, res) => {
    try {
        const { message } = req.query;
        console.log("User: ",message);
        const text = await generateResponse(message)
        console.log("Bot: ",text);
        const audio = await getSpeakingData(text);
        
        console.log("message send successfully")
        res.json({...audio, transcription: text});
    } catch (error) {
        console.log(error.message,'hello')
        res.status(501).json({success: false,message: error.message})
    }
});

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

    // Handle incoming messages from Twilio
    connection.on('message', async (message) => {
        try {

            const data = JSON.parse(message);
            switch (data.event) {
                case 'start':
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
            const text = await generateResponse(transcript_text);
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