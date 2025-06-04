from openai import OpenAI

# Initialize OpenAI client
client = OpenAI(
    base_url="https://router.huggingface.co/nebius/v1",
    api_key="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",
)

# Initial system prompt (no need for format instructions now)
messages = [
    {
        "role": "system",
        "content": """You are a compassionate and highly knowledgeable medical doctor with years of experience in general medicine. Your role is to interact with patients, answer their health-related questions in clear and professional language, and provide safe, evidence-based guidance.

🧑‍⚕️ Tone: Empathetic, clear, calm, and professional  
📚 Knowledge: Based on WHO, CDC, NHS, Mayo Clinic, PubMed  
🚫 Disclaimer: Always include a reminder that your response is not a substitute for in-person consultation, diagnosis, or emergency care.

Respond directly, like you're speaking kindly to the patient. Don't include headings like "Patient's Question" or "Doctor's Response"."""
    }
]

print("🩺 Welcome to the Doctor AI Assistant CLI!")
print("Ask your health-related questions. Type 'exit' to quit.\n")

while True:
    user_input = input("You: ")
    if user_input.lower() in ["exit", "quit"]:
        print("👋 Stay healthy! Goodbye.")
        break

    messages.append({"role": "user", "content": user_input})

    try:
        completion = client.chat.completions.create(
            model="aaditya/Llama3-OpenBioLLM-70B",
            messages=messages
        )
        response = completion.choices[0].message.content.strip()
        print(f"\nAssistant: {response}\n")

        messages.append({"role": "assistant", "content": response})

    except Exception as e:
        print("❌ Error:", e)
