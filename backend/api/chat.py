from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.session import get_db
from core.security import get_current_user_email
from pydantic import BaseModel
from services.chat import ChatService

router = APIRouter(prefix="/api/chat", tages=["Chat"])

class MessageCreate(BaseModel):
    content: str

@router.post("/room", status_code=status.HTTP_201_CREATED)
def create_chat_room(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    return ChatService.create_room(db, current_user_email)

@router.get("/rooms")
def get_chat_rooms(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    return ChatService.get_user_rooms(db, current_user_email)

@router.post("/{room_id}/message", status_code=status.HTTP_201_CREATED)
def send_chat_message(room_id: int, message_data: MessageCreate, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    return ChatService.process_chat_message(db, room_id, current_user_email, message_data.content)