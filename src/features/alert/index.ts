// Types (Phase 3-8: 서버 API 구조에 맞춘 타입)
export type {
  AlertCondition,
  AlertRuleCreateRequest,
  AlertRuleUpdateRequest,
  AlertRuleResponseDto,
  AlertHistoryResponseDto,
} from './types';

// Hooks (Phase 3-8: TanStack Query 기반 훅)
export { useAlertRule } from './hooks';

// API (Phase 3-8: 실제 API)
export {
  createAlertRule,
  getAlertRules,
  getAlertRuleDetail,
  updateAlertRule,
  deleteAlertRule,
  toggleAlertRule,
  getAlertHistory,
  getAlertHistoryDetail,
} from './api';
