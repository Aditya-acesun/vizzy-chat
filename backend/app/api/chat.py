import json
import uuid
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.intent_parser import parse_intent
from app.services.image_service import generate_image, generate_image_from_upload
from app.services.copy_service import generate_copy
from app.services.memory_service import get_memory, update_memory, get_style_context

router = APIRouter()

@router.websocket("/ws/chat/{session_id}")
async def chat_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()

    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            user_message = payload.get("message", "")
            multi = payload.get("multi", False)
            uploaded_image = payload.get("image", None)

            intent_result = parse_intent(user_message)
            intent = intent_result["intent"]

            await websocket.send_json({
                "type": "status",
                "content": "✦ Understanding your request..."
            })

            style_context = get_style_context(session_id)
            enriched_prompt = user_message + style_context

            # image upload flow
            if uploaded_image:
                await websocket.send_json({
                    "type": "status",
                    "content": "🖼️ Transforming your image..."
                })
                results = await generate_image_from_upload(enriched_prompt, uploaded_image)
                response = {
                    "content_type": "image",
                    "images": results,
                    "prompt": user_message,
                    "id": str(uuid.uuid4())
                }

            elif intent in ("image", "multi"):
                count = 2 if multi else 1
                await websocket.send_json({
                    "type": "status",
                    "content": f"🎨 Generating {'2 variants' if multi else 'image'}..."
                })
                results = await generate_image(enriched_prompt, count=count)
                response = {
                    "content_type": "image_grid" if multi else "image",
                    "images": results,
                    "prompt": user_message,
                    "id": str(uuid.uuid4())
                }

            elif intent == "video":
                response = {
                    "content_type": "text",
                    "content": "🎬 Video generation coming soon!",
                    "id": str(uuid.uuid4())
                }

            elif intent == "copy":
                result = generate_copy(user_message)
                response = {
                    "content_type": "text",
                    "content": result["content"],
                    "id": result["id"]
                }

            else:
                response = {
                    "content_type": "text",
                    "content": "✦ Try asking me to paint, draw, write a caption, or generate variants!",
                    "id": str(uuid.uuid4())
                }

            update_memory(session_id, user_message, response)
            await websocket.send_json({"type": "done", **response})

    except WebSocketDisconnect:
        pass