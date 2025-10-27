/**
 * Mock 알림 데이터
 * - 사용자별 알림 데이터 생성
 * - Phase 3-6: localStorage 기반 Mock 구현
 */

import type { Notification } from '../types';

/**
 * 사용자별 Mock 알림 데이터 생성
 * @param userId - 사용자 ID
 * @returns Mock 알림 목록
 */
export function getMockNotificationsForUser(userId: number): Notification[] {
  const now = new Date();

  // 김순자 (노인 - soonja) - userId: 1
  if (userId === 1) {
    return [
      {
        id: 'noti-1',
        type: 'DAILY_CHECK',
        level: 'LOW',
        title: '오늘 기분이 어떠세요?',
        message: 'AI가 안부를 묻고 있습니다. 오늘 하루는 어떠셨나요?',
        isRead: false,
        createdAt: new Date(now.getTime() - 3600000).toISOString(), // 1시간 전
      },
      {
        id: 'noti-2',
        type: 'SYSTEM',
        level: 'LOW',
        title: '보호자 등록이 완료되었습니다',
        message: '김영희님이 회원님의 보호자로 등록되었습니다.',
        isRead: true,
        createdAt: new Date(now.getTime() - 86400000 * 2).toISOString(), // 2일 전
      },
    ];
  }

  // 김영희 (보호자 - younghee) - userId: 2
  if (userId === 2) {
    return [
      {
        id: 'noti-3',
        type: 'ALERT',
        level: 'HIGH',
        title: '이상 징후가 감지되었습니다',
        message: '김순자님께서 3일간 우울한 감정을 보이고 있습니다. 확인이 필요합니다.',
        isRead: false,
        createdAt: new Date(now.getTime() - 1800000).toISOString(), // 30분 전
        data: { alertId: 1 },
      },
      {
        id: 'noti-4',
        type: 'GUARDIAN_REQUEST',
        level: 'MEDIUM',
        title: '보호자 요청이 왔습니다',
        message: '김순자님이 회원님을 보호자로 등록하길 원합니다.',
        isRead: true,
        createdAt: new Date(now.getTime() - 86400000 * 3).toISOString(), // 3일 전
        data: { guardianRequestId: 1 },
      },
      {
        id: 'noti-5',
        type: 'ALERT',
        level: 'MEDIUM',
        title: '24시간 무응답',
        message: '김순자님이 24시간 동안 응답하지 않았습니다.',
        isRead: true,
        createdAt: new Date(now.getTime() - 86400000 * 5).toISOString(), // 5일 전
        data: { alertId: 2 },
      },
    ];
  }

  // 박철수 (다중 보호자 - cheolsu) - userId: 3
  if (userId === 3) {
    return [
      {
        id: 'noti-6',
        type: 'ALERT',
        level: 'EMERGENCY',
        title: '긴급 상황 감지',
        message: '부모님께서 "쓰러졌어요" 라는 메시지를 보내셨습니다. 즉시 확인이 필요합니다.',
        isRead: false,
        createdAt: new Date(now.getTime() - 600000).toISOString(), // 10분 전
        data: { alertId: 3 },
      },
    ];
  }

  // 신규 사용자: 빈 알림
  return [];
}
