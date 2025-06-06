'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

import { ErrorPage } from '../shared/ui/component/ErrorPage';

export default function GlobalError({ error }: { error: Error & { digest?: string } }) {
  useEffect(() => {
    Sentry.captureException(error, {
      level: 'error',
    });
  }, [error]);

  return (
    <html>
      <body>
        <ErrorPage />
      </body>
    </html>
  );
}
