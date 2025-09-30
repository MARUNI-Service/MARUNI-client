import type { ComponentProps } from 'react';

export interface InputProps extends Omit<ComponentProps<'input'>, 'className'> {
  /**
   * 입력 필드의 라벨
   */
  label?: string;

  /**
   * 에러 메시지 (표시할 경우)
   */
  error?: string;

  /**
   * 전체 너비 사용 여부
   */
  fullWidth?: boolean;

  /**
   * 도움말 텍스트
   */
  helperText?: string;

  /**
   * 필수 입력 표시 여부
   */
  required?: boolean;
}