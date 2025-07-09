import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { NodeSDK } from '@opentelemetry/sdk-node';

const ENV = process.env.OTEL_EXPORTER_ENV === 'production' ? 'prod' : 'dev';
const SERVICE_NAME = `nextjs-${ENV}`;
const OTEL_COLLECTOR_URL = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: `${OTEL_COLLECTOR_URL}/v1/traces`,
  }),
  metricReader: new PeriodicExportingMetricReader({
    exporter: new OTLPMetricExporter({
      url: `${OTEL_COLLECTOR_URL}/v1/metrics`,
    }),
    exportIntervalMillis: 30000, // 30초 간격
  }),
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start();
console.log(`[OTEL] Initialized for service: ${SERVICE_NAME}`);

// graceful shutdown
process.on('SIGTERM', () => {
  sdk.shutdown().then(() => {
    console.log('[OTEL] Shutdown complete');
    process.exit(0);
  });
});
