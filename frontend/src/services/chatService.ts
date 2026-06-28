import type { ChatRoom, SendMessageRequest, SendMessageResponse } from '../types/chat';
import apiClient from './apiClient';

export async function createChatRoom(): Promise<ChatRoom> {
  const { data } = await apiClient.post<ChatRoom>('/api/chat/room');
  return data;
}

export async function getChatRooms(): Promise<ChatRoom[]> {
  const { data } = await apiClient.get<ChatRoom[]>('/api/chat/rooms');
  return data;
}

export async function sendMessage(
  roomId: number,
  payload: SendMessageRequest,
): Promise<SendMessageResponse> {
  const { data } = await apiClient.post<SendMessageResponse>(
    `/api/chat/${roomId}/message`,
    payload,
  );
  return data;
}
