import * as Sentry from '@sentry/nextjs';

export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    await import('../sentry.server.config');

    // 프로덕션 환경에서만 OpenTelemetry 초기화
    if (process.env.NODE_ENV === 'production') {
      const { register: registerOTel } = await import('./otel');
      registerOTel();
    }
  }

  if (process.env.NEXT_RUNTIME === 'edge') {
    await import('../sentry.edge.config');
  }
}

export const onRequestError = Sentry.captureRequestError;
