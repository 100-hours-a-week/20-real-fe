import { afterAll, afterEach, beforeAll, beforeEach } from 'vitest';

import { server } from '@test/msw/server';
import { cleanup } from '@testing-library/react';


beforeAll(() => server.listen())
beforeEach(() => cleanup())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())
