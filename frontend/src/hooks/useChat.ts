import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as chatService from '../services/chatService';
import type { ChatRoom, Message } from '../types/chat';

const ACTIVE_CHAT_ROOM_STORAGE_KEY = 'activeChatRoomId';

interface UseChatResult {
  activeRoom: ChatRoom | null;
  activeRoomId: number | null;
  clearError: () => void;
  createRoom: () => Promise<ChatRoom>;
  error: string | null;
  isCreatingRoom: boolean;
  isLoadingRooms: boolean;
  isLoadingMessages: boolean; // 1. 메시지 로딩 상태 추가
  isSendingMessage: boolean;
  loadRooms: () => Promise<ChatRoom[]>;
  messages: Message[];
  rooms: ChatRoom[];
  selectRoom: (roomId: number) => void;
  sendMessage: (content: string) => Promise<void>;
}

interface UseChatOptions {
  enabled?: boolean;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return '알 수 없는 오류가 발생했습니다.';
}

function getStoredActiveRoomId(): number | null {
  try {
    const storedRoomId = localStorage.getItem(ACTIVE_CHAT_ROOM_STORAGE_KEY);
    if (storedRoomId === null) {
      return null;
    }

    const parsedRoomId = Number(storedRoomId);
    return Number.isInteger(parsedRoomId) ? parsedRoomId : null;
  } catch {
    return null;
  }
}

function setStoredActiveRoomId(roomId: number): void {
  try {
    localStorage.setItem(ACTIVE_CHAT_ROOM_STORAGE_KEY, String(roomId));
  } catch {
    return;
  }
}

function removeStoredActiveRoomId(): void {
  try {
    localStorage.removeItem(ACTIVE_CHAT_ROOM_STORAGE_KEY);
  } catch {
    return;
  }
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

export function useChat({ enabled = true }: UseChatOptions = {}): UseChatResult {
  const [activeRoomId, setActiveRoomId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isLoadingRooms, setIsLoadingRooms] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false); // 메시지 로딩 상태
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messagesByRoomId, setMessagesByRoomId] = useState<Record<number, Message[]>>({});
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const loadedMessageRoomIds = useRef<Set<number>>(new Set());
  const localMessageId = useRef(-1);

  const activeRoom = useMemo(
    () => rooms.find((room) => room.id === activeRoomId) ?? null,
    [activeRoomId, rooms],
  );

  const messages = useMemo(() => {
    if (activeRoomId === null) return [];
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
    if (!enabled) {
      setRooms([]);
      setActiveRoomId(null);
      return [];
    }

    setIsLoadingRooms(true);
    setError(null);
    try {
      const loadedRooms = await chatService.getChatRooms();
      setRooms(loadedRooms);
      setActiveRoomId((currentRoomId) => {
        const storedRoomId = getStoredActiveRoomId();

        if (storedRoomId !== null && loadedRooms.some((room) => room.id === storedRoomId)) {
          return storedRoomId;
        }

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
  }, [enabled]);

  // 2. 특정 방의 내역을 불러오는 함수 분리 및 고도화
  const loadMessagesOfRoom = useCallback(async (roomId: number) => {
    if (loadedMessageRoomIds.current.has(roomId)) {
      return;
    }

    loadedMessageRoomIds.current.add(roomId);

    setIsLoadingMessages(true);
    setError(null);
    try {
      // API 명세에 따라 적절한 메서드(예: chatService.getMessages(roomId))가 있다고 가정합니다.
      const history = await chatService.getChatRoomMessages(roomId); 
      setMessagesByRoomId((currentMessages) => ({
        ...currentMessages,
        [roomId]: history,
      }));
    } catch (caughtError) {
      loadedMessageRoomIds.current.delete(roomId);
      setError(getErrorMessage(caughtError));
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const createRoom = useCallback(async () => {
    if (!enabled) {
      const authError = new Error('로그인이 필요합니다.');
      setError(authError.message);
      throw authError;
    }

    setIsCreatingRoom(true);
    setError(null);
    try {
      const createdRoom = await chatService.createChatRoom();
      setRooms((currentRooms) => [
        createdRoom,
        ...currentRooms.filter((room) => room.id !== createdRoom.id),
      ]);
      setActiveRoomId(createdRoom.id);
      setStoredActiveRoomId(createdRoom.id);
      loadedMessageRoomIds.current.add(createdRoom.id);
      setMessagesByRoomId((currentMessages) => ({
        ...currentMessages,
        [createdRoom.id]: [],
      }));
      return createdRoom;
    } catch (caughtError) {
      setError(getErrorMessage(caughtError));
      throw caughtError;
    } finally {
      setIsCreatingRoom(false);
    }
  }, [enabled]);

  const selectRoom = useCallback((roomId: number) => {
    setActiveRoomId(roomId);
    setStoredActiveRoomId(roomId);
    setMessagesByRoomId((currentMessages) => ({
      ...currentMessages,
      [roomId]: currentMessages[roomId] ?? [],
    }));
  }, []);

  // 3. activeRoomId가 바뀔 때마다 해당 방의 대화 내역 자동 로드
  useEffect(() => {
    if (activeRoomId !== null) {
      void loadMessagesOfRoom(activeRoomId);
    }
  }, [activeRoomId, loadMessagesOfRoom]);

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmedContent = content.trim();
      if (!trimmedContent) return;

      if (activeRoomId === null) {
        const noRoomError = new Error('채팅방을 먼저 선택해주세요.');
        setError(noRoomError.message);
        throw noRoomError;
      }

      const tempUserMessageId = nextLocalMessageId();
      const userMessage = createLocalMessage(
        tempUserMessageId,
        activeRoomId,
        'user',
        trimmedContent,
      );

      // UI에 유저가 보낸 메시지 낙관적 선반영
      setMessagesByRoomId((currentMessages) => ({
        ...currentMessages,
        [activeRoomId]: [...(currentMessages[activeRoomId] ?? []), userMessage],
      }));
      setIsSendingMessage(true);
      setError(null);

      try {
        const response = await chatService.sendMessage(activeRoomId, { content: trimmedContent });
        
        // AI 답변 메시지 객체 생성 (실제 서버 응답 데이터 바인딩)
        const assistantMessage = createLocalMessage(
          response.assistant_message?.id ?? nextLocalMessageId(), // ◀ 이렇게 수정!
          activeRoomId,
          'assistant',
          response.answer,
        );

        setMessagesByRoomId((currentMessages) => {
          const currentRoomMessages = currentMessages[activeRoomId] ?? [];
          
          // 4. 동기화 핵심: 임시 아이디로 박아둔 유저 대화 정보를 서버가 가공한 실제 데이터(id 등)로 치환
          const syncedUserMessages = currentRoomMessages.map((msg) => {
            if (msg.id === tempUserMessageId && response.user_message) {
              return response.user_message; // 서버 응답에 담긴 정제된 유저 메시지 객체로 변경
            }
            return msg;
          });

          return {
            ...currentMessages,
            [activeRoomId]: [...syncedUserMessages, assistantMessage],
          };
        });
      } catch (caughtError) {
        // 5. 전송 에러 시 낙관적 업데이트 롤백 처리
        setMessagesByRoomId((currentMessages) => ({
          ...currentMessages,
          [activeRoomId]: (currentMessages[activeRoomId] ?? []).filter((msg) => msg.id !== tempUserMessageId),
        }));
        setError(getErrorMessage(caughtError));
        throw caughtError;
      } finally {
        setIsSendingMessage(false);
      }
    },
    [activeRoomId, nextLocalMessageId],
  );

  useEffect(() => {
    if (!enabled) {
      setRooms([]);
      setActiveRoomId(null);
      setMessagesByRoomId({});
      removeStoredActiveRoomId();
      loadedMessageRoomIds.current.clear();
      setIsLoadingRooms(false);
      setIsLoadingMessages(false);
      return;
    }

    void loadRooms().catch(() => undefined);
  }, [enabled, loadRooms]);

  return {
    activeRoom,
    activeRoomId,
    clearError,
    createRoom,
    error,
    isCreatingRoom,
    isLoadingRooms,
    isLoadingMessages,
    isSendingMessage,
    loadRooms,
    messages,
    rooms,
    selectRoom,
    sendMessage,
  };
}
