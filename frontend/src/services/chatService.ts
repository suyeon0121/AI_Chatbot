import type { ChatRoom, SendMessageRequest, SendMessageResponse, Message } from '../types/chat';
import apiClient from './apiClient';

/**
 * 새로운 채팅방을 생성합니다.
 */
export async function createChatRoom(): Promise<ChatRoom> {
  try {
    const { data } = await apiClient.post<ChatRoom>('/api/chat/rooms');
    return data;
  } catch (error) {
    console.error('chatService.createChatRoom 실패:', error);
    throw error;
  }
}

/**
 * 사용자의 모든 채팅방 목록을 조회합니다.
 */
export async function getChatRooms(): Promise<ChatRoom[]> {
  try {
    const { data } = await apiClient.get<ChatRoom[]>('/api/chat/rooms');
    return data;
  } catch (error) {
    console.error('chatService.getChatRooms 실패:', error);
    throw error;
  }
}

/**
 * 1. [기능 추가] 특정 채팅방의 기존 메시지 내역(History)을 조회합니다.
 * useChat 훅에서 방을 전환할 때 과거 기록을 불러오기 위해 필수적인 API입니다.
 */
export async function getChatRoomMessages(roomId: number): Promise<Message[]> {
  try {
    const { data } = await apiClient.get<Message[]>(`/api/chat/${roomId}/messages`);
    return data;
  } catch (error) {
    console.error(`chatService.getChatRoomMessages 실패 (roomId: ${roomId}):`, error);
    throw error;
  }
}

export async function deleteChatRoom(roomId: number): Promise<void> {
  try {
    await apiClient.delete(`/api/chat/${roomId}`);
  } catch (error) {
    console.error(`chatService.deleteChatRoom 실패 (roomId: ${roomId}):`, error);
    throw error;
  }
}

/**
 * 선택된 채팅방에 메시지를 전송하고 AI의 답변을 받아옵니다.
 */
export async function sendMessage(
  roomId: number,
  payload: SendMessageRequest,
): Promise<SendMessageResponse> {
  try {
    const { data } = await apiClient.post<SendMessageResponse>(
      `/api/chat/${roomId}/messages`,
      payload,
    );
    return data;
  } catch (error) {
    console.error(`chatService.sendMessage 실패 (roomId: ${roomId}):`, error);
    throw error;
  }
}
