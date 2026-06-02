from AI_CORE.providers.gemini_provider import GeminiProvider
from AI_CORE.providers.ollama_provider import OllamaProvider
from config.logger import logger

class ProviderRouter:

    def __init__(self):
        self.gemini = GeminiProvider()
        self.ollama = OllamaProvider()

    def generate(self, prompt):

        try:
            return self.gemini.generate(prompt)

        except Exception as e:

            logger.error(f"Gemini failed: {e}")

            # TEMPORARY DEBUG
            return f"GEMINI ERROR: {str(e)}"