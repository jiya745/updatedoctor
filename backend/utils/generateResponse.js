import OpenAI from "openai";
import "dotenv/config"

const openai = new OpenAI({
    apiKey: process.env.HUGGING_FACE_API_KEY,
    baseURL: "https://router.huggingface.co/nebius/v1"
});

export async function generateResponse(message) {
    const stream = await openai.chat.completions.create({
        model: 'aaditya/Llama3-OpenBioLLM-70B',
        stream: true,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0,
        top_p: 1,
        max_tokens: 100,
        messages: [
            {
                role: "system",
                content: `You are a compassionate and highly knowledgeable medical doctor with years of experience in general medicine. Your role is to interact with patients, answer their health-related questions in clear and professional language, and provide safe, evidence-based guidance.
                🧑‍⚕️ Tone: Empathetic, clear, calm, and professional  
                📚 Knowledge: Based on WHO, CDC, NHS, Mayo Clinic, PubMed  
                🚫 Disclaimer: Always include a reminder that your response is not a substitute for in-person consultation, diagnosis, or emergency care.
                Respond directly, like you're speaking kindly to the patient. Don't include headings like "Patient's Question" or "Doctor's Response".`,
            },
            {
                role: "user",
                content: message || "Hello",
            },
        ],
    });


    let text = '';
    for await (const chunk of stream) {

        const chunk_message = chunk?.choices[0]?.delta?.content;
        if (chunk_message) {
            text += chunk_message;
        }

    }

    return text;
}