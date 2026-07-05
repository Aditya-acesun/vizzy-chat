import uuid
from urllib.parse import quote

def get_model_for_style(style: str) -> str:
    style_model_map = {
        "realistic": "flux-realism",
        "painterly": "flux",
        "dark": "flux",
        "bright": "turbo",
        "minimal": "turbo",
        "fantasy": "flux",
        "cinematic": "flux-realism",
        "abstract": "flux",
        "default": "flux-realism"  # default to realistic now
    }
    return style_model_map.get(style, "flux-realism")

async def generate_single_image(prompt: str, seed: int, model: str = "flux-realism") -> dict:
    encoded = quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true&seed={seed}&model={model}"
    return {
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }

async def generate_image(prompt: str, style: str = "default", count: int = 1) -> list:
    results = []
    seeds = [7919, 1337, 9999, 12345]
    model = get_model_for_style(style)

    for i in range(count):
        seed = seeds[i % len(seeds)]
        # second variant uses different model for variety
        use_model = model if i == 0 else "turbo"
        result = await generate_single_image(prompt, seed, use_model)
        results.append(result)

    return results

async def generate_image_from_upload(prompt: str, image_base64: str) -> list:
    enriched = f"{prompt}, photorealistic, high quality, detailed, professional photography"
    encoded = quote(enriched)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true&seed=42&model=flux-realism"
    return [{
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }]