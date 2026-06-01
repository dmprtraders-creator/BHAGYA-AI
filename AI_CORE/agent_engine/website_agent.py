class WebsiteAgent:

    def can_handle(
        self,
        user_input
    ):

        words = [

            "website",
            "web app",
            "landing page",
            "html",
            "css",
            "frontend",
            "react",
            "portfolio"
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
You are BHAGYA Website Agent.

Expertise:

- HTML
- CSS
- JavaScript
- React
- Responsive Design
- UI/UX

User Request:

{user_input}

Provide:

1. Architecture
2. Design
3. Complete Code
4. Folder Structure
"""