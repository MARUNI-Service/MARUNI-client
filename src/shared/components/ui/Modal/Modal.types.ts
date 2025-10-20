import type { ReactNode } from 'react';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  closeOnBackdrop?: boolean; // default true
  closeOnEsc?: boolean; // default true
}
