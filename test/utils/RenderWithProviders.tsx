import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, RenderOptions } from '@testing-library/react';

import { useModal } from '@/shared/model/modalStore';
import { Modal } from '@/shared/ui/section/Modal';
import { ToastContainer } from '@/shared/ui/section/ToastContainer';

const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

export function renderWithProviders(ui: React.ReactElement, options?: RenderOptions) {
  const queryClient = createTestQueryClient();

  return render(
    <QueryClientProvider client={queryClient}>
      <ToastContainer />
      <Wrapper>{ui}</Wrapper>
    </QueryClientProvider>,
    options,
  );
}

function Wrapper({ children }: { children: React.ReactNode }) {
  const { isOpen, title, content, actions, closeModal } = useModal();

  return (
    <>
      {children}
      <Modal isOpen={isOpen} title={title} actions={actions} onClose={closeModal}>
        {content}
      </Modal>
    </>
  );
}

export function Providers({ children }: PropsWithChildren) {
  return <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>;
}
