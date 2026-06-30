from dotenv import load_dotenv
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.auth import router as auth_router
from api.chat import router as chat_router
from db.session import engine
import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="AI Chatbot API",
    description="AI 챗봇 백엔드",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 프론트엔드 URL 체계(/api/auth, /api/chat)와 일치하도록 prefix 추가
app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(chat_router, prefix="/api/chat", tags=["Chat"])

@app.get("/")
def read_root():
    return {"message": "AI Chatbot Backend Server is running successfully!"}