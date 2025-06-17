import { vi } from 'vitest';
import { chunks } from '@test/mocks/chatbot/data/success';

type MessageHandler = (this: EventSource, ev: MessageEvent<string>) => void;
type ErrorHandler = (this: EventSource, ev: Event) => void;
type OpenHandler = (this: EventSource, ev: Event) => void;

export class MockEventSource {
  static instances: MockEventSource[] = [];

  public onmessage: MessageHandler | null = null;
  public onerror: ErrorHandler | null = null;
  public onopen: OpenHandler | null = null;

  public readyState = 0;
  public url: string;

  constructor(url: string) {
    this.url = url;
    MockEventSource.instances.push(this);
  }

  close = vi.fn();
  addEventListener = vi.fn();
  removeEventListener = vi.fn();
  dispatchEvent = vi.fn();

  emitMessage(data: string) {
    const event = new MessageEvent<string>('message', { data });
    this.onmessage?.call(this as unknown as EventSource, event);
  }

  emitError(event: Event = new Event('error')) {
    this.onerror?.call(this as unknown as EventSource, event);
  }

  static reset() {
    MockEventSource.instances = [];
  }
}

export function mockEventSource() {
  MockEventSource.reset();

  vi.stubGlobal('EventSource', MockEventSource as unknown as typeof EventSource);
}

// export function mockEventSource() {
//   global.EventSource = vi.fn(() => {
//     const listeners: Record<string, Array<(e: MessageEvent) => void>> = {};
//
//     setTimeout(() => {
//       chunks.forEach((chunk) => {
//         const data = chunk.replace(/^data:\s*/, '');
//         listeners['message']?.forEach((callback) => {
//           callback(new MessageEvent('message', { data }));
//         });
//       });
//     }, 0);
//
//
//     return {
//       addEventListener: vi.fn((event: string, callback: (e: MessageEvent) => void) => {
//         if (!listeners[event]) listeners[event] = [];
//         listeners[event].push(callback);
//       }),
//
//       close: vi.fn(),
//     };
//   }) as unknown as typeof EventSource;
// }

