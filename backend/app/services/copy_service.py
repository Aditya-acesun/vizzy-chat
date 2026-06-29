import uuid

COPY_TEMPLATES = {
    "poster": [
        "Where every moment becomes a masterpiece.",
        "Crafted for those who dare to dream.",
        "Elevate the ordinary. Celebrate the extraordinary.",
    ],
    "social": [
        "Some things are worth framing. ✨",
        "This one's for the dreamers.",
        "Made with intention, shared with love.",
    ],
    "product": [
        "Premium quality. Unmatched experience.",
        "Because details matter.",
        "Designed to impress. Built to last.",
    ]
}

def generate_copy(prompt: str, copy_type: str = "social") -> dict:
    import random
    templates = COPY_TEMPLATES.get(copy_type, COPY_TEMPLATES["social"])
    chosen = random.choice(templates)

    return {
        "id": str(uuid.uuid4()),
        "content": f'✍️ Here\'s your copy for "{prompt}":\n\n**"{chosen}"**\n\nWant a different style? Try asking for a poster, social, or product caption.',
        "type": "text"
    }