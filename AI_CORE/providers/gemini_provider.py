import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

genai.configure(
    api_key=os.getenv("GEMINI_API_KEY")
)


class GeminiProvider:

    def __init__(self):
        self.model = genai.GenerativeModel(
            "gemini-2.5-flash"
        )

    def generate(self, prompt):

        response = self.model.generate_content(prompt)

        return response.text