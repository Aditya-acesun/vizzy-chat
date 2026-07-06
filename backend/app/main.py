from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import chat, generate, assets, users
from app.models.user import Base
from app.core.dependencies import engine

app = FastAPI(title=settings.APP_NAME, debug=settings.DEBUG)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(generate.router, prefix="/api")
app.include_router(assets.router, prefix="/api")
app.include_router(users.router, prefix="/api")

@app.on_event("startup")
async def startup():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/health")
async def health():
    return {"status": "ok", "app": settings.APP_NAME}

@app.get("/debug")
async def debug():
    return {
        "stability_key_set": bool(settings.STABILITY_API_KEY),
        "groq_key_set": bool(settings.GROQ_API_KEY),
        "stability_key_preview": settings.STABILITY_API_KEY[:8] + "..." if settings.STABILITY_API_KEY else "NOT SET",
        "app": settings.APP_NAME
    }