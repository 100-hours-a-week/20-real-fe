import dotenv from 'dotenv';

import { OTLPHttpProtoTraceExporter, registerOTel } from '@vercel/otel';

dotenv.config({ path: '.env.production' });

const ENV = process.env.OTEL_EXPORTER_ENV === 'production' ? 'prod' : 'dev';
const SERVICE_NAME = `nextjs-${ENV}`;

export function register() {
  registerOTel({
    serviceName: SERVICE_NAME,
    traceExporter: new OTLPHttpProtoTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    }),
  });
}

console.log(`[OTEL] Initialized for service: ${SERVICE_NAME}`);
