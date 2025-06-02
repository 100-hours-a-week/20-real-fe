import { create } from 'zustand';

import { ReactNode } from 'react';

import { ModalAction } from '@/components/common/organisms/Modal';

interface OpenModalParams {
  title: string;
  content?: ReactNode;
  actions?: ModalAction[];
}

interface ModalState {
  isOpen: boolean;
  title: string;
  content: ReactNode | null;
  actions: ModalAction[];
  openModal: (params: OpenModalParams) => void;
  closeModal: () => void;
}

export const useModal = create<ModalState>((set) => ({
  isOpen: false,
  title: '',
  content: null,
  actions: [],
  openModal: ({ title, content = null, actions = [] }: OpenModalParams) => {
    set({ isOpen: true, title, content, actions });
  },
  closeModal: () => set({ isOpen: false, title: '', content: null, actions: [] }),
}));
