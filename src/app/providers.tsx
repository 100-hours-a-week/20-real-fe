'use client';

import { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '@/shared/lib/tanstack-query/queryClient';
import { useModal } from '@/shared/model/modalStore';

import { Modal } from '../shared/ui/section/Modal';

export default function Providers({ children }: { children: ReactNode }) {
  const { isOpen, title, content, actions, closeModal } = useModal();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
      <Modal isOpen={isOpen} title={title} actions={actions} onClose={closeModal}>
        {content}
      </Modal>
    </QueryClientProvider>
  );
}
