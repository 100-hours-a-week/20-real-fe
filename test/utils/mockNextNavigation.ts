import { vi } from 'vitest';

export function mockNextNavigation() {
  vi.mock('next/navigation', () => ({
    usePathname: () => '',
    useSearchParams: () => new URLSearchParams(''),
    useRouter: () => ({
      push: vi.fn(),
    }),
  }));
}
