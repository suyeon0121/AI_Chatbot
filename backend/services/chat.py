import os
from sqlalchemy.orm import Session
from google import genai
from google.genai import types
from fastapi import HTTPException, status
from models.chat import ChatRoom, ChatMessage
from models import User

gemini_client = genai.Client(api_key=os.getenv("OPENAI_API_KEY"))

class ChatService:
    @staticmethod
    def create_room(db: Session, user_email: str):
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
            
        new_room = ChatRoom(user_id=user.id, title="새로운 대화")
        db.add(new_room)
        db.commit()
        db.refresh(new_room)
        return new_room
    
    @staticmethod
    def get_user_rooms(db: Session, user_email: str):
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
            
        return db.query(ChatRoom).filter(ChatRoom.user_id == user.id).order_by(ChatRoom.created_at.desc()).all()
    
    @staticmethod
    def process_chat_message(db: Session, room_id: int, user_email: str, content: str):
        user = db.query(User).filter(User.email == user_email).first()
        if not user:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="사용자를 찾을 수 없습니다.")
            
        room = db.query(ChatRoom).filter(ChatRoom.id == room_id, ChatRoom.user_id == user.id).first()
        
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="대화방을 찾을 수 없습니다.")
        
        # 1. 유저 메시지 저장
        user_message = ChatMessage(room_id=room_id, sender_type="user", content=content)
        db.add(user_message)
        db.commit()

        try:
            response = gemini_client.models.generate_content(
                model='gemini-2.5-flash',  
                contents=content,
                config=types.GenerateContentConfig(
                    system_instruction="You are a helpful AI chatbot assistant."
                )
            )
            ai_response_text = response.text

        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, 
                detail=f"AI 오류: {str(e)}"
            )

        ai_message = ChatMessage(room_id=room_id, sender_type="assistant", content=ai_response_text)
        db.add(ai_message)
        db.commit()
        
        return {"answer": ai_response_text}