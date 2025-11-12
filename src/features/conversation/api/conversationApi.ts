import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/constants/api';
import type { CommonApiResponse } from '@/shared/types/common';
import type { SendMessageRequest, ConversationResponseDto, MessageDto } from '../types';

/**
 * AI 대화 메시지 전송
 * POST /api/conversations/messages
 * Phase 3-8: 실제 API 호출
 */
export async function sendMessage(request: SendMessageRequest): Promise<ConversationResponseDto> {
  // 500자 제한 검증
  if (request.content.length > 500) {
    throw new Error('메시지는 500자를 초과할 수 없습니다');
  }

  const response = await apiClient.post<CommonApiResponse<ConversationResponseDto>>(
    API_ENDPOINTS.CONVERSATIONS.SEND_MESSAGE,
    request
  );

  if (!response.data.data) {
    throw new Error(response.data.message || '메시지 전송 실패');
  }

  return response.data.data;
}

/**
 * 대화 내역 조회
 * GET /api/conversations/history?days={days}
 * Phase 3-8: 실제 API 호출
 */
export async function getHistory(days: number = 7): Promise<MessageDto[]> {
  const response = await apiClient.get<CommonApiResponse<MessageDto[]>>(
    `${API_ENDPOINTS.CONVERSATIONS.HISTORY}?days=${days}`
  );

  if (!response.data.data) {
    throw new Error(response.data.message || '대화 내역 조회 실패');
  }

  // 디버깅: 서버에서 받은 시간 형식 확인
  if (response.data.data.length > 0) {
    console.log('🔍 서버에서 받은 첫 메시지:', response.data.data[0]);
    console.log('🔍 createdAt 원본:', response.data.data[0].createdAt);
    console.log('🔍 createdAt 타입:', typeof response.data.data[0].createdAt);
  }

  return response.data.data;
}

/**
 * 가장 최근 메시지 조회
 * GET /api/conversations/messages/latest
 * Phase 3-8: 홈 화면 최근 대화 표시용
 */
export async function getLatestMessage(): Promise<MessageDto | null> {
  const response = await apiClient.get<CommonApiResponse<MessageDto | null>>(
    API_ENDPOINTS.CONVERSATIONS.LATEST_MESSAGE
  );

  // data가 null일 수 있음 (메시지가 없는 경우)
  return response.data.data;
}
