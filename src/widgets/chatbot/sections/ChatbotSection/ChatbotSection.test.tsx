import { beforeEach, describe, expect, it, vi } from 'vitest';

import { chunks } from '@test/mocks/chatbot/data/success';
import { MockEventSource, mockEventSource } from '@test/utils/mockEventSource';
import { mockScrollIntoView } from '@test/utils/mockScrollIntoView';
import { renderWithProviders } from '@test/utils/renderWithProviders';
import { screen } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { ChatbotSection } from '@/widgets/chatbot/sections/ChatbotSection/ChatbotSection';

describe('챗봇', () => {
  beforeEach(() => {
    // 운영 시간 내(평일 9~18시) 사이로 모킹
    vi.setSystemTime(new Date('2025-06-16T10:00:00+09:00'));
    mockEventSource();
    mockScrollIntoView();
    renderWithProviders(<ChatbotSection />);
  });

  it('추천 질문 클릭 시 챗봇 응답이 렌더링된다.', async () => {
    const $questions = await screen.findAllByTestId('suggest-question');
    const $firstQuestion = $questions[0];
    const question = $firstQuestion.textContent ?? '';
    await userEvent.click($firstQuestion);

    // Mock SSE 응답 emit
    const sse = MockEventSource.instances[0];
    chunks.forEach((chunk) => {
      sse.emitMessage(chunk);
    });

    // 질문 존재 여부
    await screen.findByText(question);
    // SSE 응답 존재 여부
    for (const text of chunks) {
      expect(await screen.findByText(new RegExp(text))).toBeTruthy();
    }
  });

  it('질문 입력 후 전송 시 챗봇 응답이 렌더링된다.', async () => {
    const question = '반가워요.';

    const $input: HTMLInputElement = await screen.findByTestId('chatbot-input');
    await userEvent.type($input, question);
    await userEvent.keyboard('{enter}');
    // Mock SSE 응답 emit
    const sse = MockEventSource.instances[0];
    chunks.forEach((chunk) => {
      sse.emitMessage(chunk);
    });

    // 질문 존재 여부
    await screen.findByText(question);
    // SSE 응답 존재 여부
    for (const text of chunks) {
      expect(await screen.findByText(new RegExp(text))).toBeTruthy();
    }
  });

  it('500자 이상 입력한다면, 입력을 제한하고 토스트 메시지를 띄운다.', async () => {
    const question = 'a'.repeat(501);
    const $input: HTMLInputElement = await screen.findByTestId('chatbot-input');
    await userEvent.type($input, question);

    // 500자 초과 텍스트 삭제
    expect($input.value.length).toBe(500);
    // 토스트 메시지
    await screen.findByText(/메시지는 최대 500자까지 입력 가능합니다./);
  });

  it('운영 시간 외에 질문을 보내면 에러 메시지를 띄운다.', async () => {
    vi.setSystemTime(new Date('2025-06-16T08:00:00+09:00'));
    const question = '반가워요.';

    const $input: HTMLInputElement = await screen.findByTestId('chatbot-input');
    await userEvent.type($input, question);
    await userEvent.keyboard('{enter}');

    await screen.findByText(/운영시간 안내/);
  });

  it('알 수 없는 이슈로 챗봇 응답을 받는걸 실패하면 에러 메시지를 띄운다.', async () => {
    const question = '반가워요.';

    const $input: HTMLInputElement = await screen.findByTestId('chatbot-input');
    await userEvent.type($input, question);
    await userEvent.keyboard('{enter}');

    // 에러 발생
    const sse = MockEventSource.instances[0];
    sse.emitError();

    await screen.findByText(/일시적 오류/);
  });

  it('질문을 입력하지 않으면 전송 버튼이 비활성화 된다.', async () => {
    const $sendButton: HTMLButtonElement = await screen.findByTestId('chatbot-send-button');
    expect($sendButton.getAttribute('disabled')).not.toBeNull();
  });

  it('질문 응답을 받는 동안은 전송 버튼이 비활성화 된다.', async () => {
    const question = '반가워요.';

    const $input: HTMLInputElement = await screen.findByTestId('chatbot-input');
    await userEvent.type($input, question);
    await userEvent.keyboard('{enter}');

    const sse = MockEventSource.instances[0];

    // 질문 존재 여부
    await screen.findByText(question);
    // 로딩 인디케이터 존재 여부
    await screen.findByTestId('chatbot-loading');

    // SSE 응답 emit
    chunks.forEach((chunk) => {
      sse.emitMessage(chunk);
    });

    // 응답 존재 여부
    for (const text of chunks) {
      expect(await screen.findByText(new RegExp(text))).toBeTruthy();
    }
  });
});
