from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text
from sqlalchemy.orm import relationship, declarative_base

Base = declarative_base()

class ChatRoom(Base):
    __tablename__ = "chat_rooms"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), default="새로운 대화", nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    user = relationship("User", back_populates="chat_rooms")
    message = relationship("ChatMessage", back_populates="room", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    rood_id = Column(Integer, ForeignKey("chat_room.id", ondelete="CASCADE"), nullable=False)
    sender_type = Column(String(20), nullable=False)
    content = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.now, nullable=False)
    room = relationship("ChatRoom", back_populates="messages")