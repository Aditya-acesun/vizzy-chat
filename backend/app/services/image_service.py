import uuid
from urllib.parse import quote

async def generate_single_image(prompt: str, seed: int) -> dict:
    encoded = quote(prompt)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&seed={seed}&model=flux"
    return {
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }

async def generate_image(prompt: str, style: str = "default", count: int = 1) -> list:
    results = []
    seeds = [7919, 1337, 9999, 12345]
    models = ["flux", "turbo", "flux-realism", "flux"]
    for i in range(count):
        encoded = quote(prompt)
        seed = seeds[i % len(seeds)]
        model = models[i % len(models)]
        url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&seed={seed}&model={model}"
        results.append({
            "id": str(uuid.uuid4()),
            "url": url,
            "prompt": prompt,
            "type": "image"
        })
    return results

async def generate_image_from_upload(prompt: str, image_base64: str) -> list:
    enriched = f"{prompt}, inspired by uploaded reference image, high quality"
    encoded = quote(enriched)
    url = f"https://image.pollinations.ai/prompt/{encoded}?width=512&height=512&nologo=true&seed=42&model=flux"
    return [{
        "id": str(uuid.uuid4()),
        "url": url,
        "prompt": prompt,
        "type": "image"
    }]