import type { Meta, StoryObj } from '@storybook/nextjs-vite';

import { AppError } from '@/shared/errors/appError';
import { ErrorCode } from '@/shared/errors/errors';

import '@/app/globals.css';
import { ErrorHandler } from './ErrorHandler';

const meta: Meta<typeof ErrorHandler> = {
  title: 'Common/ErrorHandler',
  component: ErrorHandler,
  tags: ['autodocs'],
};

export default meta;

const createError = (code: ErrorCode): AppError => {
  return AppError.create(code);
};

export const Unauthorized: StoryObj = {
  render: () => <ErrorHandler error={createError('UNAUTHORIZED')} />,
};

export const Forbidden: StoryObj = {
  render: () => <ErrorHandler error={createError('FORBIDDEN')} />,
};

export const Unknown: StoryObj = {
  render: () => <ErrorHandler error={createError('UNKNOWN')} />,
};
