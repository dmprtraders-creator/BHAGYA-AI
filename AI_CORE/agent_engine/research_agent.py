class ResearchAgent:

    def can_handle(
        self,
        user_input
    ):

        words = [

            "research",
            "analyze",
            "study",
            "compare",
            "market",
            "report"
        ]

        text = user_input.lower()

        return any(
            word in text
            for word in words
        )

    def build_prompt(
        self,
        user_input
    ):

        return f"""
You are BHAGYA Research Agent.

Perform deep research.

User Request:

{user_input}

Provide:

1. Analysis
2. Findings
3. Recommendations
4. Conclusion
"""