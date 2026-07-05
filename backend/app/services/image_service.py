import uuid
import random
from urllib.parse import quote

def get_model_for_style(style: str) -> str:
    style_model_map = {
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
    return style_model_map.get(style, "flux-realism")

async def generate_single_image(prompt: str, seed: int, model: str = "flux-realism") -> dict:
    encoded = quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true&seed={seed}&model={model}&cache=false"
    return {
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }

async def generate_image(prompt: str, style: str = "default", count: int = 1) -> list:
    results = []
    model = get_model_for_style(style)

    for i in range(count):
        seed = random.randint(1, 999999)  # fully random seed every time
        result = await generate_single_image(prompt, seed, model)
        results.append(result)

    return results

async def generate_image_from_upload(prompt: str, image_base64: str) -> list:
    enriched = f"{prompt}, photorealistic, high quality, detailed, professional photography"
    encoded = quote(enriched)
    seed = random.randint(1, 999999)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true&seed={seed}&model=flux-realism&cache=false"
    return [{
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }]