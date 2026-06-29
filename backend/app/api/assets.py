import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.dependencies import get_db
from app.models.asset import Asset
from pydantic import BaseModel

router = APIRouter()

class AssetIn(BaseModel):
    session_id: str
    type: str
    url: str
    prompt: str

@router.post("/assets")
async def save_asset(data: AssetIn, db: AsyncSession = Depends(get_db)):
    asset = Asset(
        id=str(uuid.uuid4()),
        session_id=data.session_id,
        type=data.type,
        url=data.url,
        prompt=data.prompt
    )
    db.add(asset)
    await db.commit()
    return {"id": asset.id, "status": "saved"}

@router.get("/assets/{session_id}")
async def get_assets(session_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(
        select(Asset).where(Asset.session_id == session_id).order_by(Asset.created_at.desc())
    )
    assets = result.scalars().all()
    return {"assets": [
        {"id": a.id, "url": a.url, "prompt": a.prompt, "type": a.type, "created_at": str(a.created_at)}
        for a in assets
    ]}