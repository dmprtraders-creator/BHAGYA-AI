class CodingAgent:

    def can_handle(
        self,
        user_input
    ):

        coding_words = [

            "python",
            "code",
            "bug",
            "error",
            "fix",
            "api",
            "fastapi",
            "javascript",
            "html",
            "css",
            "sql",
            "program",
            "website",
            "app",
            "function",
            "class"
        ]

        text = user_input.lower()

        return any(
            word in text
            for word in coding_words
        )

    def build_prompt(
        self,
        user_input
    ):

        return f"""
You are BHAGYA Coding Agent.

Your task:

1. Analyze code.
2. Explain bugs.
3. Generate code.
4. Improve architecture.
5. Build websites.
6. Build APIs.
7. Build AI systems.

User Request:

{user_input}

Provide:
- Explanation
- Solution
- Full code when needed
"""