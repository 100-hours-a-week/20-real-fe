import { ErrorLevel } from './errorLevels';
import { ErrorCode, Errors } from './errors';
import { convertTagsToRecord } from './errorTags';

export interface AppErrorOptions {
  code: ErrorCode;
  messageOverride?: string;
  extra?: Record<string, unknown>;
  capture?: boolean;
}

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly level: ErrorLevel;
  readonly tags: Record<string, string>;
  readonly extra?: Record<string, unknown>;

  constructor(options: AppErrorOptions) {
    const meta = Errors[options.code];
    super(options.messageOverride ?? meta.message);

    this.name = 'AppError';
    this.code = options.code;
    this.level = meta.level;
    this.tags = convertTagsToRecord([...(meta.tags ?? [])]);
    this.extra = options.extra;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppError);
    }

    if (options.capture) {
      this.capture();
    }
  }

  static create(code: ErrorCode, options?: Partial<Omit<AppErrorOptions, 'code'>>): AppError {
    return new AppError({ code, ...options });
  }

  capture(): this {
    import('@sentry/nextjs').then((Sentry) =>
      Sentry.captureException(this, {
        level: this.level,
        tags: this.tags,
        extra: this.extra,
      }),
    );
    return this;
  }
}
