import { afterAll, afterEach, beforeAll } from 'vitest';

import { server } from '@/shared/lib/msw/server';

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
