from AI_CORE.providers.gemini_provider import GeminiProvider
from AI_CORE.providers.ollama_provider import OllamaProvider
from config.logger import logger


class ProviderRouter:

    def __init__(self):
        self.gemini = GeminiProvider()
        self.ollama = OllamaProvider()

    def generate(self, prompt):

        try:
            logger.info("Using Gemini")

            return self.gemini.generate(prompt)

        except Exception as e:

            logger.error(f"Gemini failed: {e}")

            logger.info("Switching to Ollama")

            return self.ollama.generate(prompt)