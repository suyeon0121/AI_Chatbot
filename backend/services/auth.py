from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from models.user import User
from core.security import get_password_hash, verify_password, create_access_token

class AuthService:
    @staticmethod
    def register_user(db: Session, user_data):
        existing_user = db.query(User).filter(User.email == user_data.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="이미 가입된 이메일 주소입니다."
            )
    
        hashed_pwd = get_password_hash(user_data.password)
        new_user = User(
            email=user_data.email,
            hashed_password=hashed_pwd,
            nickname=user_data.nickname
        )
        
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return {"message": "회원가입이 성공적으로 완료되었습니다.", "user_id": new_user.id}

    @staticmethod
    def authenticate_user(db: Session, user_data):
        email = getattr(user_data, "email", None) or getattr(user_data, "username", None)
        user = db.query(User).filter(User.email == email).first()
        
        if not user or not verify_password(user_data.password, user.hashed_password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="이메일 또는 비밀번호가 올바르지 않습니다."
            )
        
        access_token = create_access_token(data={"sub": user.email})
        return {"access_token": access_token, "token_type": "bearer"}