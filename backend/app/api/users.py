import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.dependencies import get_db
from app.models.user import User
from pydantic import BaseModel

router = APIRouter()

class UserIn(BaseModel):
    name: str = ""
    preferences: dict = {}
    brand_profile: dict = {}

@router.post("/users")
async def create_user(data: UserIn, db: AsyncSession = Depends(get_db)):
    user = User(
        id=str(uuid.uuid4()),
        name=data.name,
        preferences=data.preferences,
        brand_profile=data.brand_profile
    )
    db.add(user)
    await db.commit()
    return {"id": user.id, "name": user.name}

@router.get("/users/{user_id}")
async def get_user(user_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(User).where(User.id == user_id))
    user = result.scalar_one_or_none()
    if not user:
        return {"error": "User not found"}
    return {"id": user.id, "name": user.name, "preferences": user.preferences}