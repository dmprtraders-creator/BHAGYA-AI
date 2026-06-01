import os
from dotenv import load_dotenv
from google import genai

# Loads your API key securely from your .env file
load_dotenv()

class Assistant:
    def __init__(self):
        # Starts the fresh Gemini 2.5 flash client
        self.client = genai.Client()
        print("⚡ BHAGYA AI is online and ready to think! ⚡")

    def respond(self, command):
        try:
            response = self.client.models.generate_content(
                model='gemini-2.5-flash',
                contents=command,
            )
            print(f"\nAI: {response.text}")
        except Exception as e:
            print(f"\nError connecting to AI: {e}")

ai = Assistant()

# Main interactive loop (completely left-aligned to prevent indentation errors)
while True:
    cmd = input("\nYou: ")
    
    if cmd.lower() in ['exit', 'quit']:
        print("Goodbye!")
        break
        
    if cmd.strip():
        ai.respond(cmd)