import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as chatService from '../services/chatService';
import type { ChatRoom, Message } from '../types/chat';

interface UseChatResult {
  activeRoom: ChatRoom | null;
  activeRoomId: number | null;
  clearError: () => void;
  createRoom: () => Promise<ChatRoom>;
  error: string | null;
  isCreatingRoom: boolean;
  isLoadingRooms: boolean;
  isSendingMessage: boolean;
  loadRooms: () => Promise<ChatRoom[]>;
  messages: Message[];
  rooms: ChatRoom[];
  selectRoom: (roomId: number) => void;
  sendMessage: (content: string) => Promise<void>;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return '알 수 없는 오류가 발생했습니다.';
}

function createLocalMessage(
  id: number,
  roomId: number,
  senderType: Message['sender_type'],
  content: string,
): Message {
  return {
    content,
    created_at: new Date().toISOString(),
    id,
    room_id: roomId,
    sender_type: senderType,
  };
}

export function useChat(): UseChatResult {
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messagesByRoomId, setMessagesByRoomId] = useState<Record<number, Message[]>>({});
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const localMessageId = useRef(-1);

  const activeRoom = useMemo(
    () => rooms.find((room) => room.id === activeRoomId) ?? null,
    [activeRoomId, rooms],
  );

  const messages = useMemo(() => {
    if (activeRoomId === null) {
      return [];
    }

    return messagesByRoomId[activeRoomId] ?? [];
  }, [activeRoomId, messagesByRoomId]);

  const nextLocalMessageId = useCallback(() => {
    const nextId = localMessageId.current;
    localMessageId.current -= 1;
    return nextId;
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const loadRooms = useCallback(async () => {
    setIsLoadingRooms(true);
    setError(null);

    try {
      const loadedRooms = await chatService.getChatRooms();
      setRooms(loadedRooms);
      setActiveRoomId((currentRoomId) => {
        if (currentRoomId !== null && loadedRooms.some((room) => room.id === currentRoomId)) {
          return currentRoomId;
        }

        return loadedRooms[0]?.id ?? null;
      });

      return loadedRooms;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    } finally {
      setIsLoadingRooms(false);
    }
  }, []);

  const createRoom = useCallback(async () => {
    setIsCreatingRoom(true);
    setError(null);

    try {
      const createdRoom = await chatService.createChatRoom();
      setRooms((currentRooms) => [
        createdRoom,
        ...currentRooms.filter((room) => room.id !== createdRoom.id),
      ]);
      setActiveRoomId(createdRoom.id);
      setMessagesByRoomId((currentMessages) => ({
        ...currentMessages,
        [createdRoom.id]: currentMessages[createdRoom.id] ?? [],
      }));

      return createdRoom;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    } finally {
      setIsCreatingRoom(false);
    }
  }, []);

  const selectRoom = useCallback((roomId: number) => {
    setActiveRoomId(roomId);
    setMessagesByRoomId((currentMessages) => ({
      ...currentMessages,
      [roomId]: currentMessages[roomId] ?? [],
    }));
  }, []);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();

      if (!trimmedContent) {
        return;
      }

      if (activeRoomId === null) {
        const noRoomError = new Error('채팅방을 먼저 선택해주세요.');
        setError(noRoomError.message);
        throw noRoomError;
      }

      const userMessage = createLocalMessage(
        nextLocalMessageId(),
        activeRoomId,
        'user',
        trimmedContent,
      );

      setMessagesByRoomId((currentMessages) => ({
        ...currentMessages,
        [activeRoomId]: [...(currentMessages[activeRoomId] ?? []), userMessage],
      }));
      setIsSendingMessage(true);
      setError(null);

      try {
        const response = await chatService.sendMessage(activeRoomId, { content: trimmedContent });
        const assistantMessage = createLocalMessage(
          nextLocalMessageId(),
          activeRoomId,
          'assistant',
          response.answer,
        );

        setMessagesByRoomId((currentMessages) => ({
          ...currentMessages,
          [activeRoomId]: [...(currentMessages[activeRoomId] ?? []), assistantMessage],
        }));
      } catch (caughtError) {
        setError(getErrorMessage(caughtError));
        throw caughtError;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [activeRoomId, nextLocalMessageId],
  );

  useEffect(() => {
    void loadRooms().catch(() => undefined);
  }, [loadRooms]);

  return {
    activeRoom,
    activeRoomId,
    clearError,
    createRoom,
    error,
    isCreatingRoom,
    isLoadingRooms,
    isSendingMessage,
    loadRooms,
    messages,
    rooms,
    selectRoom,
    sendMessage,
  };
}
