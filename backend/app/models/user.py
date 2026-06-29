from sqlalchemy import Column, String, DateTime, JSON
from sqlalchemy.orm import DeclarativeBase
import datetime

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True)
    name = Column(String, nullable=True)
    preferences = Column(JSON, default={})
    brand_profile = Column(JSON, default={})
    created_at = Column(DateTime, default=datetime.datetime.utcnow)