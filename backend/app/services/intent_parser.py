import os
from groq import Groq
from app.core.config import settings

client = Groq(api_key=settings.GROQ_API_KEY) if settings.GROQ_API_KEY else None

FALLBACK_KEYWORDS = {
    "image": ["paint", "draw", "generate", "artwork", "photo", "visualize",
              "illustration", "poster", "vision board", "moodboard", "style transfer",
              "create", "make", "show", "render", "picture", "image"],
    "video": ["video", "loop", "animate", "motion", "reel", "clip", "animation"],
    "copy":  ["write", "caption", "tagline", "slogan", "story", "poem", "copy", "message", "text"],
    "multi": ["variants", "options", "multiple", "different versions", "choices"],
}

def fallback_parse(message: str) -> dict:
    msg = message.lower()
    for intent, keywords in FALLBACK_KEYWORDS.items():
        if any(kw in msg for kw in keywords):
            return {"intent": intent, "enhanced_prompt": message, "confidence": "keyword"}
    return {"intent": "image", "enhanced_prompt": message, "confidence": "default"}

def parse_intent(user_message: str) -> dict:
    if not client:
        return fallback_parse(user_message)

    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": """You are an AI creative assistant intent classifier.
                    
Analyze the user message and respond with ONLY a JSON object in this exact format:
{
  "intent": "image" | "video" | "copy" | "multi",
  "enhanced_prompt": "improved, detailed version of the prompt for better AI generation",
  "style": "realistic" | "painterly" | "dark" | "bright" | "minimal" | "fantasy" | "cinematic" | "abstract",
  "confidence": "high" | "medium" | "low"
}

Intent rules:
- "image": user wants to generate/create/paint/draw/visualize any visual content
- "video": user wants animation, motion, video, loop, reel
- "copy": user wants text, caption, tagline, story, poem, message
- "multi": user wants multiple variants or options

Enhanced prompt rules:
- Make the prompt more descriptive and detailed for better AI image generation
- Add style, lighting, composition details
- Keep the original intent but make it richer
- Example: "paint a sunset" -> "a breathtaking oil painting of a golden sunset over the ocean, dramatic clouds, warm orange and purple hues, impressionist style, highly detailed"

Only respond with the JSON object, no other text."""
                },
                {"role": "user", "content": user_message}
            ],
            temperature=0.3,
            max_tokens=300
        )

        import json
        text = response.choices[0].message.content.strip()
        text = text.replace("```json", "").replace("```", "").strip()
        result = json.loads(text)

        return {
            "intent": result.get("intent", "image"),
            "enhanced_prompt": result.get("enhanced_prompt", user_message),
            "style": result.get("style", "realistic"),
            "confidence": result.get("confidence", "high")
        }

    except Exception as e:
        print(f"Groq intent parse failed: {e}")
        return fallback_parse(user_message)