export type SenderType = 'user' | 'assistant';

export interface ChatRoom {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
  // 1. 사이드바나 목록에서 "최근 대화 순" 정렬을 위해 실무에서 자주 쓰이는 필드
  updated_at: string; 
}

export interface Message {
  id: number;
  room_id: number;
  sender_type: SenderType;
  content: string;
  created_at: string;
  // 2. AI 답변 도중 에러가 나거나 전송 실패 시 UI 처리를 위한 옵셔널 필드
  is_failed?: boolean; 
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  answer: string;
  // 3. [동기화 핵심] 낙관적 업데이트를 완벽하게 처리하기 위해 백엔드에서 함께 내려주면 좋은 필드
  user_message?: Message;      // 서버에 저장되어 정식 ID(Positive ID)가 발급된 유저 메시지 객체
  assistant_message?: Message; // 서버가 생성한 AI 메시지 전체 객체
}