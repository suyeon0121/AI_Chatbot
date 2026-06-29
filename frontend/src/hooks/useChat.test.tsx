/* @vitest-environment jsdom */

import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import * as chatService from '../services/chatService';
import type { ChatRoom } from '../types/chat';
import { useChat } from './useChat';

vi.mock('../services/chatService');

const firstRoom: ChatRoom = {
  created_at: '2026-06-29T10:00:00.000Z',
  id: 1,
  title: '첫 번째 대화',
  user_id: 10,
};

const secondRoom: ChatRoom = {
  created_at: '2026-06-29T11:00:00.000Z',
  id: 2,
  title: '두 번째 대화',
  user_id: 10,
};

describe('useChat', () => {
  beforeEach(() => {
    vi.mocked(chatService.getChatRooms).mockResolvedValue([]);
    vi.mocked(chatService.createChatRoom).mockResolvedValue(firstRoom);
    vi.mocked(chatService.sendMessage).mockResolvedValue({ answer: '안녕하세요.' });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('loads chat rooms and selects the first room on mount', async () => {
    vi.mocked(chatService.getChatRooms).mockResolvedValue([secondRoom, firstRoom]);

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.rooms).toEqual([secondRoom, firstRoom]);
    });

    expect(chatService.getChatRooms).toHaveBeenCalledTimes(1);
    expect(result.current.activeRoomId).toBe(secondRoom.id);
    expect(result.current.activeRoom).toEqual(secondRoom);
    expect(result.current.isLoadingRooms).toBe(false);
  });

  it('creates a chat room, prepends it to the list, and selects it', async () => {
    vi.mocked(chatService.getChatRooms).mockResolvedValue([firstRoom]);
    vi.mocked(chatService.createChatRoom).mockResolvedValue(secondRoom);

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.rooms).toEqual([firstRoom]);
    });

    await act(async () => {
      await expect(result.current.createRoom()).resolves.toEqual(secondRoom);
    });

    expect(chatService.createChatRoom).toHaveBeenCalledTimes(1);
    expect(result.current.rooms).toEqual([secondRoom, firstRoom]);
    expect(result.current.activeRoomId).toBe(secondRoom.id);
    expect(result.current.messages).toEqual([]);
    expect(result.current.isCreatingRoom).toBe(false);
  });

  it('selects a chat room and exposes messages for that room only', async () => {
    vi.mocked(chatService.getChatRooms).mockResolvedValue([firstRoom, secondRoom]);

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.activeRoomId).toBe(firstRoom.id);
    });

    await act(async () => {
      await result.current.sendMessage('첫 번째 방 메시지');
    });

    expect(result.current.messages).toHaveLength(2);

    act(() => {
      result.current.selectRoom(secondRoom.id);
    });

    expect(result.current.activeRoomId).toBe(secondRoom.id);
    expect(result.current.activeRoom).toEqual(secondRoom);
    expect(result.current.messages).toEqual([]);
  });

  it('sends a message and appends local user and assistant messages', async () => {
    vi.mocked(chatService.getChatRooms).mockResolvedValue([firstRoom]);
    vi.mocked(chatService.sendMessage).mockResolvedValue({ answer: 'AI 응답입니다.' });

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.activeRoomId).toBe(firstRoom.id);
    });

    await act(async () => {
      await result.current.sendMessage('  질문입니다.  ');
    });

    expect(chatService.sendMessage).toHaveBeenCalledWith(firstRoom.id, {
      content: '질문입니다.',
    });
    expect(result.current.messages).toHaveLength(2);
    expect(result.current.messages[0]).toMatchObject({
      content: '질문입니다.',
      room_id: firstRoom.id,
      sender_type: 'user',
    });
    expect(result.current.messages[1]).toMatchObject({
      content: 'AI 응답입니다.',
      room_id: firstRoom.id,
      sender_type: 'assistant',
    });
    expect(result.current.isSendingMessage).toBe(false);
  });

  it('does not send an empty message', async () => {
    vi.mocked(chatService.getChatRooms).mockResolvedValue([firstRoom]);

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.activeRoomId).toBe(firstRoom.id);
    });

    await act(async () => {
      await result.current.sendMessage('   ');
    });

    expect(chatService.sendMessage).not.toHaveBeenCalled();
    expect(result.current.messages).toEqual([]);
  });

  it('sets an error when sending without an active room', async () => {
    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.isLoadingRooms).toBe(false);
    });

    await act(async () => {
      await expect(result.current.sendMessage('질문')).rejects.toThrow('채팅방을 먼저 선택해주세요.');
    });

    expect(result.current.error).toBe('채팅방을 먼저 선택해주세요.');
    expect(chatService.sendMessage).not.toHaveBeenCalled();
  });

  it('stores and clears service errors', async () => {
    const serviceError = new Error('목록을 불러오지 못했습니다.');
    vi.mocked(chatService.getChatRooms).mockRejectedValue(serviceError);

    const { result } = renderHook(() => useChat());

    await waitFor(() => {
      expect(result.current.error).toBe('목록을 불러오지 못했습니다.');
    });

    act(() => {
      result.current.clearError();
    });

    expect(result.current.error).toBeNull();
  });
});
