import OpenAI from "openai";
import "dotenv/config"

const openai = new OpenAI({
    apiKey: process.env.HUGGING_FACE_API_KEY,
    baseURL: "https://router.huggingface.co/nebius/v1"
});

export async function generateResponse(messages) {
    const stream = await openai.chat.completions.create({
        model: 'aaditya/Llama3-OpenBioLLM-70B',
        stream: true,
        temperature: 0.7,
        presence_penalty: 0.6,
        frequency_penalty: 0,
        top_p: 1,
        max_tokens: 100,
        messages,
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