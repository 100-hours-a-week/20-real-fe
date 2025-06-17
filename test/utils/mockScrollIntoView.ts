import { vi } from 'vitest';

export function mockScrollIntoView() {
  Element.prototype.scrollIntoView = vi.fn();
}
