export const ErrorLevels = {
  FATAL: 'fatal',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
  DEBUG: 'debug',
} as const;

export type ErrorLevel = (typeof ErrorLevels)[keyof typeof ErrorLevels];
