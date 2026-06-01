from AI_CORE.providers.ollama_provider import OllamaProvider

provider = OllamaProvider()

response = provider.generate("Say hello in one sentence")

print(response)