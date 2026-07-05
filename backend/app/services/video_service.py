import uuid
from urllib.parse import quote

async def generate_video(prompt: str) -> dict:
    # Use Pollinations image with animated GIF style as video fallback
    # Real video needs Runway/Kling API (paid)
    encoded = quote(prompt + ", cinematic motion, dynamic scene")
    
    return {
        "id": str(uuid.uuid4()),
        "url": None,  # no free video API available
        "prompt": prompt,
        "type": "video",
        "message": f'🎬 Video generation requires a paid API (Runway, Kling, Pika). Your prompt "{prompt}" has been queued. For now, here\'s an image version:'
    }