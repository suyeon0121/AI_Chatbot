import os
from sqlalchemy.orm import Session
from openai import OpenAI
from fastapi import HTTPException, status
from models.chat import ChatRoom, ChatMessage
from models import User

openai_client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

class ChatService:
    @staticmethod
    def create_room(db: Session, user_email: str):
        user = db.query(User).filter(User.email == user_email).first()
        new_room = ChatRoom(user_id=user.id, title="새로운 대화")
        db.add(new_room)
        db.commit()
        db.refresh(new_room)
        return new_room
    
    @staticmethod
    def get_user_rooms(db: Session, user_email: str):
        user = db.query(User).filter(User.email == user_email).first()
        return db.query(ChatRoom).filter(ChatRoom.user_id == user.id).order_by(ChatRoom.created_at.desc()).all()
    
    @staticmethod
    def process_chat_message(db: Session, room_id: int, user_email: str, content: str):
        user = db.query(User).filter(User.email == user_email).first()
        room = db.query(ChatRoom).filter(ChatRoom.id == room_id, ChatRoom.user_id == user.id).first()
        
        if not room:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="대화방을 찾을 수 없습니다.")
        
        user_message = ChatMessage(room_id=room_id, sender_type="user", content=content)
        db.add(user_message)
        db.commit()

        try:
            response = openai_client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are a helpful AI chatbot assistant."},
                    {"role": "user", "content": content}
                ]
            )
            ai_response_text = response.choices[0].message.content
        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"AI 오류: {str(e)}")
        
        ai_message = ChatMessage(room_id=room_id, sender_type="assistant", content=ai_response_text)
        db.add(ai_message)
        db.commit()
        return {"answer": ai_response_text}