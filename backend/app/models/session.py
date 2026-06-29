from sqlalchemy import Column, String, DateTime, JSON, ForeignKey
from app.models.user import Base
import datetime

class ChatSession(Base):
    __tablename__ = "chat_sessions"
    id = Column(String, primary_key=True)
    user_id = Column(String, nullable=True)
    messages = Column(JSON, default=[])
    created_at = Column(DateTime, default=datetime.datetime.utcnow)