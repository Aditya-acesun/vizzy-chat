import uuid
from urllib.parse import quote

async def generate_video(prompt: str) -> dict:
    encoded = quote(prompt)
    # Pollinations video endpoint
    video_url = f"https://video.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true"

    return {
        "id": str(uuid.uuid4()),
        "url": video_url,
        "prompt": prompt,
        "type": "video"
    }