import json
import os

from AI_CORE.provider_router import ProviderRouter

from AI_CORE.agent_engine.coding_agent import CodingAgent
from AI_CORE.agent_engine.website_agent import WebsiteAgent
from AI_CORE.agent_engine.research_agent import ResearchAgent
from AI_CORE.agent_engine.deployment_agent import DeploymentAgent

# -----------------------------
# VECTOR MEMORY
# -----------------------------

try:

    from AI_CORE.memory_engine.vector_memory import (
        add_memory,
        search_memory
    )

except Exception as e:

    print(
        "Vector memory import error:",
        e
    )

    add_memory = None
    search_memory = None


# -----------------------------
# AGENTS
# -----------------------------

router = ProviderRouter()

coding_agent = CodingAgent()
website_agent = WebsiteAgent()
research_agent = ResearchAgent()
deployment_agent = DeploymentAgent()

MEMORY_FILE = "bhagya_memory.json"

# -----------------------------
# SYSTEM PROMPT
# -----------------------------

SYSTEM_PROMPT = """
You are BHAGYA.

Your name is BHAGYA.

You are an advanced AI assistant created by Raghu Vaid.

if any(
    phrase in user_input.lower()
    for phrase in [
        "who are you",
        "what is your name",
        "tell me about yourself",
        "who created you"
    ]
):
    return (
        "I am BHAGYA, an AI assistant created by "
        "Raghu Vaid. I help with coding, website "
        "development, research, automation, AI "
        "development, content creation, and "
        "problem solving."
    )
Capabilities:
- Coding
- AI Development
- Research
- Business Assistance
- Automation
- Learning
- Problem Solving
- Website Development
- Content Creation

Rules:
- Be helpful.
- Be accurate.
- Be professional.
- Remember important information.
- Always identify yourself as BHAGYA.
"""

# -----------------------------
# MEMORY FUNCTIONS
# -----------------------------

def load_memory():

    if os.path.exists(MEMORY_FILE):

        try:

            with open(
                MEMORY_FILE,
                "r",
                encoding="utf-8"
            ) as f:

                return json.load(f)

        except Exception:

            return []

    return []


def save_memory(memory):

    with open(
        MEMORY_FILE,
        "w",
        encoding="utf-8"
    ) as f:

        json.dump(
            memory,
            f,
            indent=4,
            ensure_ascii=False
        )


conversation_history = load_memory()


# -----------------------------
# MAIN PROCESS REQUEST
# -----------------------------

def process_request(user_input):

    global conversation_history

    print(f"User Input: {user_input}")

    # -----------------------------
    # SHORT TERM MEMORY
    # -----------------------------

    conversation_history.append({
        "role": "user",
        "content": user_input
    })

    recent_history = conversation_history[-20:]

    history_text = ""

    for msg in recent_history:

        history_text += (
            f"{msg['role']}: "
            f"{msg['content']}\n"
        )

    # -----------------------------
    # VECTOR MEMORY SEARCH
    # -----------------------------

    memory_context = ""

    if search_memory:

        try:

            memories = search_memory(
                user_input
            )

            memory_context = "\n".join(
                memories
            )

        except Exception as e:

            print(
                "Vector memory error:",
                e
            )

    # -----------------------------
    # AGENT ROUTING
    # -----------------------------

    if coding_agent.can_handle(user_input):

        print("Routing -> Coding Agent")

        final_prompt = (
            coding_agent.build_prompt(
                user_input
            )
        )

    elif website_agent.can_handle(user_input):

        print("Routing -> Website Agent")

        final_prompt = (
            website_agent.build_prompt(
                user_input
            )
        )

    elif research_agent.can_handle(user_input):

        print("Routing -> Research Agent")

        final_prompt = (
            research_agent.build_prompt(
                user_input
            )
        )

    elif deployment_agent.can_handle(user_input):

        print("Routing -> Deployment Agent")

        final_prompt = (
            deployment_agent.build_prompt(
                user_input
            )
        )

    else:

        print("Routing -> General BHAGYA")

        final_prompt = f"""
{SYSTEM_PROMPT}

Relevant Memories:

{memory_context}

Conversation History:

{history_text}

User:
{user_input}

Assistant:
"""

    # -----------------------------
    # AI GENERATION
    # -----------------------------

    response = router.generate(
        final_prompt
    )

    # -----------------------------
    # SAVE CONVERSATION
    # -----------------------------

    conversation_history.append({
        "role": "assistant",
        "content": response
    })

    save_memory(
        conversation_history
    )

    # -----------------------------
    # SAVE TO VECTOR MEMORY
    # -----------------------------

    if add_memory:

        try:

            add_memory(
                f"User: {user_input}"
            )

            add_memory(
                f"Assistant: {response}"
            )

        except Exception as e:

            print(
                "Memory save error:",
                e
            )

    return response