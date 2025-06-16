import { afterAll, afterEach, beforeAll, beforeEach, vi } from 'vitest';

import { server } from '@test/msw/server';
import { cleanup } from '@testing-library/react';


beforeAll(() => server.listen())
beforeEach(() => {
  cleanup();
  vi.clearAllMocks();
})
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
