import { vi } from 'vitest';

export function mockIntersectionObserver() {
  const mockObserver = vi.fn().mockImplementation(() => ({
    isIntersecting: false,
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
  }));

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    configurable: true,
    value: mockObserver,
  });
}
