from fastapi import APIRouter
from pydantic import BaseModel
from app.services.intent_parser import parse_intent
from app.services.image_service import generate_image

router = APIRouter()

class GenerateRequest(BaseModel):
    prompt: str
    style: str = "default"
    count: int = 1

@router.post("/generate")
async def generate(req: GenerateRequest):
    intent = parse_intent(req.prompt)
    if intent["intent"] == "image":
        results = await generate_image(req.prompt, req.style, req.count)
        return {"success": True, "results": results}
    return {"success": False, "message": "Use WebSocket for chat-based generation"}