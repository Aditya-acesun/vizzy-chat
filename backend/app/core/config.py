from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    APP_NAME: str = "VizzyChat"
    DEBUG: bool = True
    DATABASE_URL: str = "sqlite+aiosqlite:///./vizzy.db"
    SECRET_KEY: str = "dev-secret-key"
    HF_API_KEY: str = ""
    GROQ_API_KEY: str = ""
    STABILITY_API_KEY: str = ""

settings = Settings()