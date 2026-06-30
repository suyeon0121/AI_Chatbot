from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from db.session import get_db
from core.security import get_current_user_email
from pydantic import BaseModel
from services.chat import ChatService
import models

router = APIRouter(tags=["Chat"])

class MessageCreate(BaseModel):
    content: str

# 1. 대화방 생성 API 
@router.post("/rooms", status_code=status.HTTP_201_CREATED)
def create_chat_room(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    return ChatService.create_room(db, current_user_email)

# 2. 대화방 목록 조회 API
@router.get("/rooms")
def get_chat_rooms(db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    return ChatService.get_user_rooms(db, current_user_email)

# 3. 프론트엔드 useChat 훅에서 호출하는 과거 대화 내역 조회 API
@router.get("/{room_id}/messages")
def get_chat_room_messages(room_id: int, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    return ChatService.get_room_messages(db, room_id, current_user_email)

# 4. 메시지 전송 및 AI 답변 API 
@router.post("/{room_id}/message", status_code=status.HTTP_201_CREATED)
def send_chat_message(room_id: int, message_data: MessageCreate, db: Session = Depends(get_db), current_user_email: str = Depends(get_current_user_email)):
    return ChatService.process_chat_message(db, room_id, current_user_email, message_data.content)