import uuid
import random
import base64
import httpx
from urllib.parse import quote
from app.core.config import settings

STABILITY_API_URL = "https://api.stability.ai/v2beta/stable-image/generate/core"

async def generate_with_stability(prompt: str) -> str | None:
    if not settings.STABILITY_API_KEY:
        return None
    try:
        async with httpx.AsyncClient(timeout=60) as client:
            response = await client.post(
                STABILITY_API_URL,
                headers={
                    "Authorization": f"Bearer {settings.STABILITY_API_KEY}",
                    "Accept": "image/*"
                },
                data={
                    "prompt": prompt,
                    "output_format": "jpeg",
                    "aspect_ratio": "1:1"
                }
            )
            if response.status_code == 200:
                img_b64 = base64.b64encode(response.content).decode("utf-8")
                return f"data:image/jpeg;base64,{img_b64}"
            else:
                print(f"Stability AI error: {response.status_code} {response.text}")
                return None
    except Exception as e:
        print(f"Stability AI failed: {e}")
        return None

def get_pollinations_url(prompt: str, style: str = "default") -> str:
    model_map = {
        "realistic": "flux-realism",
        "painterly": "flux",
        "dark": "flux",
        "bright": "flux-realism",
        "minimal": "flux-realism",
        "fantasy": "flux",
        "cinematic": "flux-realism",
        "abstract": "flux",
        "default": "flux-realism"
    }
    model = model_map.get(style, "flux-realism")
    seed = random.randint(100000, 999999)
    encoded = quote(prompt)
    return f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true&seed={seed}&model={model}"

async def generate_image(prompt: str, style: str = "default", count: int = 1) -> list:
    results = []

    for i in range(count):
        if i == 0 and settings.STABILITY_API_KEY:
            # first variant — try Stability AI
            url = await generate_with_stability(prompt)
            if not url:
                # fallback to Pollinations
                url = get_pollinations_url(prompt, style)
        else:
            # subsequent variants — use Pollinations
            suffix = ", cinematic lighting, ultra realistic, 8k" if i % 2 == 0 else ", highly detailed, sharp focus, professional"
            url = get_pollinations_url(prompt + suffix, style)

        results.append({
            "id": str(uuid.uuid4()),
            "url": url,
            "prompt": prompt,
            "type": "image"
        })

    return results

async def generate_image_from_upload(prompt: str, image_base64: str) -> list:
    enriched = f"{prompt}, photorealistic, high quality, detailed, professional photography"

    url = await generate_with_stability(enriched)
    if not url:
        url = get_pollinations_url(enriched, "realistic")

    return [{
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }]