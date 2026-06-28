export type SenderType = 'user' | 'assistant';

export interface ChatRoom {
  id: number;
  user_id: number;
  title: string;
  created_at: string;
}

export interface Message {
  id: number;
  room_id: number;
  sender_type: SenderType;
  content: string;
  created_at: string;
}

export interface SendMessageRequest {
  content: string;
}

export interface SendMessageResponse {
  answer: string;
}
