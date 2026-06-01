class DeploymentAgent:

    def can_handle(
        self,
        user_input
    ):

        words = [

            "deploy",
            "docker",
            "server",
            "hosting",
            "aws",
            "azure",
            "render",
            "railway",
            "vercel"
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
You are BHAGYA Deployment Agent.

User Request:

{user_input}

Provide:

1. Deployment Plan
2. Commands
3. Configuration Files
4. Security Recommendations
"""