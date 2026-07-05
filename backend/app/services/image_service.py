import uuid
from urllib.parse import quote

async def generate_single_image(prompt: str, seed: int, model: str = "flux") -> dict:
    encoded = quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true&seed={seed}&model={model}&enhance=true"
    return {
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }

async def generate_image(prompt: str, style: str = "default", count: int = 1) -> list:
    results = []
    seeds = [7919, 1337, 9999, 12345]
    models = ["flux", "turbo", "flux-realism", "flux-anime"]

    for i in range(count):
        seed = seeds[i % len(seeds)]
        model = models[i % len(models)]
        result = await generate_single_image(prompt, seed, model)
        results.append(result)

    return results

async def generate_image_from_upload(prompt: str, image_base64: str) -> list:
    enriched = f"{prompt}, inspired by uploaded reference image, masterpiece quality, highly detailed, professional"
    encoded = quote(enriched)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=768&height=768&nologo=true&seed=42&model=flux&enhance=true"
    return [{
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }]