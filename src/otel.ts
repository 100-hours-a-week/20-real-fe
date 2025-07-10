import { OTLPHttpJsonTraceExporter, registerOTel } from '@vercel/otel';

const ENV = process.env.OTEL_EXPORTER_ENV === 'production' ? 'prod' : 'dev';
const SERVICE_NAME = `nextjs-${ENV}`;

export function register() {
  registerOTel({
    serviceName: SERVICE_NAME,
    traceExporter: new OTLPHttpJsonTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT,
    }),
  });
}

console.log(`[OTEL] Initialized for service: ${SERVICE_NAME}`);
