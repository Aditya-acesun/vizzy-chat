from sqlalchemy import Column, String, DateTime, JSON
from app.models.user import Base
import datetime

class Asset(Base):
    __tablename__ = "assets"
    id = Column(String, primary_key=True)
    session_id = Column(String, nullable=True)
    type = Column(String)
    url = Column(String)
    prompt = Column(String)
    meta = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.datetime.utcnow)