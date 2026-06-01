print("========== API.PY LOADED ==========")

from fastapi import FastAPI
from fastapi.responses import HTMLResponse
from pydantic import BaseModel

from AI_CORE.orchestrator.main_orchestrator import (
    process_request
)

app = FastAPI(
    title="BHAGYA AI",
    version="1.0.0"
)


class ChatRequest(BaseModel):
    message: str


@app.get("/")
def home():
    return {
        "status": "BHAGYA Running"
    }


@app.get("/ui", response_class=HTMLResponse)
def ui():

    with open(
        "templates/chat.html",
        "r",
        encoding="utf-8"
    ) as f:

        return f.read()


@app.post("/chat")
def chat(request: ChatRequest):

    try:

        response = process_request(
            request.message
        )

        return {
            "success": True,
            "response": response
        }

    except Exception as e:

        return {
            "success": False,
            "error": str(e)
        }