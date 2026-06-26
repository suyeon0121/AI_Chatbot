from pydantic import BaseModel, EmailStr, Field

class UserCreate(BaseModel):
    email: EmailStr = Field(..., description="로그인 ID로 사용할 유효한 이메일 주소")
    password: str = Field(..., min_length=8, description="8자리 이상의 비밀번호")
    nickname: str = Field(..., min_length=2, max_length=50, description="2자 이상 50자 이하의 닉네임")

class UserLogin(BaseModel):
    email: EmailStr = Field(..., description="사용자 로그인 이메일")
    password: str = Field(..., description="사용자 비밀번호")

class Token(BaseModel):
    access_token: str = Field(..., description="JWT 액세스 토큰 문자열")
    token_type: str = Field("bearer", description="토큰 타입 (기본값: bearer)")