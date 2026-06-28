import { useCallback, useEffect, useState } from 'react';
import * as chatService from '../services/chatService';
import type { ChatRoom, Message } from '../types/chat';

export function useChat() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRooms = useCallback(async () => {
    setIsLoading(true);
    try {
      const nextRooms = await chatService.getChatRooms();
      setRooms(nextRooms);
      setActiveRoomId((currentRoomId) => currentRoomId ?? nextRooms[0]?.id ?? null);
      return nextRooms;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createRoom = useCallback(async () => {
    const room = await chatService.createChatRoom();
    setRooms((currentRooms) => [room, ...currentRooms]);
    setActiveRoomId(room.id);
    setMessages([]);
    return room;
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      if (!activeRoomId) {
        throw new Error('활성화된 채팅방이 없습니다.');
      }

      const optimisticMessage: Message = {
        id: Date.now(),
        room_id: activeRoomId,
        sender_type: 'user',
        content,
        created_at: new Date().toISOString(),
      };

      setMessages((currentMessages) => [...currentMessages, optimisticMessage]);
      const response = await chatService.sendMessage(activeRoomId, { content });

      const assistantMessage: Message = {
        id: Date.now() + 1,
        room_id: activeRoomId,
        sender_type: 'assistant',
        content: response.answer,
        created_at: new Date().toISOString(),
      };

      setMessages((currentMessages) => [...currentMessages, assistantMessage]);
      return response;
    },
    [activeRoomId],
  );

  useEffect(() => {
    void fetchRooms();
  }, [fetchRooms]);

  return {
    activeRoomId,
    createRoom,
    fetchRooms,
    isLoading,
    messages,
    rooms,
    sendMessage,
    setActiveRoomId,
  };
}
