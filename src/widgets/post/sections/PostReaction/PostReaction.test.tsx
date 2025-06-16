import { beforeEach, describe, expect, it } from 'vitest';

import { postReactionHandler } from '@test/mocks/post/handlers/postReaction.handler';
import { server } from '@test/msw/server';
import { renderWithProviders } from '@test/utils/renderWithProviders';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { PostTypes } from '@/entities/post/postType';

import { PostReaction } from './PostReaction';

describe('PostReaction', () => {
  beforeEach(() => {
    server.use(...postReactionHandler.likeSuccess);
  });

  it('좋아요 상태에 따라 상태가 정삭적으로 변경된다', async () => {
    renderWithProviders(<PostReaction type={PostTypes.Notice} postId={1} userLike={false} likeCount={0} />);

    const $button = await screen.findByTestId('like-button');
    expect($button.getAttribute('aria-pressed')).toBe('false');

    await userEvent.click($button);
    expect($button.getAttribute('aria-pressed')).toBe('true');

    await userEvent.click($button);
    expect($button.getAttribute('aria-pressed')).toBe('false');
  });

  it('연속 클릭해도 상태가 정상적으로 변경된다.', async () => {
    renderWithProviders(<PostReaction type={PostTypes.Notice} postId={1} userLike={false} likeCount={3} />);

    const $button = await screen.findByTestId('like-button');
    const countText = () => screen.getByTestId('like-count');

    expect(countText().textContent).toBe('3');
    await userEvent.click($button);
    expect(countText().textContent).toBe('4');

    await userEvent.click($button);
    await userEvent.click($button);
    await userEvent.click($button);
    expect(countText().textContent).toBe('3');
  });
});
