_memory_store: dict = {}

STYLE_KEYWORDS = {
    "realistic": ["realistic", "photo", "photograph", "real"],
    "painterly": ["paint", "painting", "artwork", "artistic", "oil"],
    "dark": ["dark", "moody", "noir", "shadow", "gloomy"],
    "bright": ["bright", "vibrant", "colorful", "vivid", "cheerful"],
    "minimal": ["minimal", "clean", "simple", "minimal"],
    "fantasy": ["fantasy", "dreamlike", "magical", "surreal", "dream"],
}

def get_memory(session_id: str) -> dict:
    return _memory_store.get(session_id, {
        "history": [],
        "preferences": {},
        "detected_style": None
    })

def update_memory(session_id: str, user_msg: str, assistant_msg: dict):
    if session_id not in _memory_store:
        _memory_store[session_id] = {
            "history": [],
            "preferences": {},
            "detected_style": None
        }

    # detect style from user message
    msg_lower = user_msg.lower()
    for style, keywords in STYLE_KEYWORDS.items():
        if any(kw in msg_lower for kw in keywords):
            _memory_store[session_id]["detected_style"] = style
            break

    _memory_store[session_id]["history"].append({
        "user": user_msg,
        "assistant": assistant_msg
    })

def get_style_context(session_id: str) -> str:
    memory = get_memory(session_id)
    style = memory.get("detected_style")
    if style:
        style_prompts = {
            "realistic": ", photorealistic, 8k, detailed",
            "painterly": ", oil painting style, artistic brushstrokes",
            "dark": ", dark moody atmosphere, dramatic lighting",
            "bright": ", vibrant colors, bright lighting, cheerful",
            "minimal": ", minimalist, clean composition, simple",
            "fantasy": ", fantasy art, dreamlike, magical atmosphere"
        }
        return style_prompts.get(style, "")
    return ""