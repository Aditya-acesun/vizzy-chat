import re

INTENT_KEYWORDS = {
    "image": ["paint", "draw", "generate image", "artwork", "photo", "visualize",
              "illustration", "poster", "vision board", "moodboard", "style transfer"],
    "video": ["video", "loop", "animate", "motion", "reel", "clip"],
    "copy":  ["write", "caption", "tagline", "slogan", "story", "poem", "copy", "message"],
    "multi": ["scene by scene", "storyboard", "sequence", "multiple", "variants"],
}

def parse_intent(user_message: str) -> dict:
    msg = user_message.lower()

    for intent, keywords in INTENT_KEYWORDS.items():
        if any(kw in msg for kw in keywords):
            return {
                "intent": intent,
                "original": user_message,
                "confidence": "keyword_match"
            }

    # default to image — most common Vizzy use case
    return {
        "intent": "image",
        "original": user_message,
        "confidence": "default"
    }