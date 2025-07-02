import { waitFor } from 'storybook/test';
import { beforeEach, describe, expect, it } from 'vitest';

import postCommentList from '@test/mocks/post/data/postCommentList/success.json';
import { postCommentHandler } from '@test/mocks/post/handlers/postComment.handler';
import { server } from '@test/msw/server';
import { flushPromises } from '@test/utils/flushPromises';
import { mockIntersectionObserver } from '@test/utils/mockIntersectionObserver';
import { renderWithProviders } from '@test/utils/renderWithProviders';
import { screen, within } from '@testing-library/dom';
import userEvent from '@testing-library/user-event';

import { PostTypes } from '@/entities/post/postType';
import { PostCommentSection } from '@/widgets/post/sections/PostCommentSection/PostCommentSection';

describe('PostCommentSection', () => {
  beforeEach(() => {
    mockIntersectionObserver();
  });

  it('댓글 목록이 정상적으로 렌더링 된다.,', async () => {
    server.use(...postCommentHandler.commentListSuccess);
    const commentCount = postCommentList.data.items.length;
    renderWithProviders(<PostCommentSection type={PostTypes.Notice} postId={1} commentCount={commentCount} />);

    const $commentCount = await screen.findByTestId('post-comment-count');
    expect($commentCount.textContent).toBe(`댓글 ${commentCount}`);

    const $commentItems = await screen.findAllByTestId('post-comment-item');
    expect($commentItems.length).toBe(commentCount);
  });

  it('본인 댓글에만 삭제 버튼이 보인다.', async () => {
    server.use(...postCommentHandler.commentListSuccess);
    renderWithProviders(
      <PostCommentSection type={PostTypes.Notice} postId={1} commentCount={postCommentList.data.items.length} />,
    );

    const $commentItems = await screen.findAllByTestId('post-comment-item');

    postCommentList.data.items.forEach((comment, index) => {
      const deleteButton = within($commentItems[index]).queryByTestId('post-comment-delete-button');
      if (comment.isAuthor) {
        expect(deleteButton).not.toBeNull();
      } else {
        expect(deleteButton).toBeNull();
      }
    });
  });

  it('댓글을 작성하면 댓글 리스트에 추가되고, 댓글 수가 1 증가한다.', async () => {
    server.use(...postCommentHandler.commentListSuccess, ...postCommentHandler.commentCreateSuccess);
    const commentCount = postCommentList.data.items.length;
    const { unmount } = renderWithProviders(
      <PostCommentSection type={PostTypes.Notice} postId={1} commentCount={commentCount} />,
    );

    // 댓글 작성
    const comment = `테스트 댓글 - ${new Date().toISOString()}`;
    const $commentInput = await screen.findByTestId('post-comment-input');
    await userEvent.type($commentInput, comment);

    const $commentSendButton = await screen.findByTestId('post-comment-submit-button');
    await userEvent.click($commentSendButton);

    // 댓글 수 +1
    await waitFor(() => {
      const $commentCount = screen.getByTestId('post-comment-count');
      expect($commentCount.textContent).toBe(`댓글 ${commentCount + 1}`);
    });

    unmount();
    await flushPromises();
    renderWithProviders(<PostCommentSection type={PostTypes.Notice} postId={1} commentCount={commentCount} />);
    await flushPromises();

    // 리스트에 해당 댓글 추가
    expect(screen.queryByText(comment)).toBeNull();
  });

  it('댓글을 삭제하면 댓글 리스트에서 삭제되고, 댓글 수가 1 감소한다.', async () => {
    server.use(
      ...postCommentHandler.commentListSuccess,
      ...postCommentHandler.commentCreateSuccess,
      ...postCommentHandler.commentDeleteSuccess,
    );
    const commentCount = postCommentList.data.items.length;
    const { unmount } = renderWithProviders(
      <PostCommentSection type={PostTypes.Notice} postId={1} commentCount={commentCount} />,
    );

    // 댓글 삭제
    const $commentItems = await screen.findAllByTestId('post-comment-item');

    const mineIndex = postCommentList.data.items.findIndex((comment) => comment.isAuthor);
    const $mineCommentItem = $commentItems[mineIndex];

    // 내 댓글 내용
    const comment = within($mineCommentItem).getByTestId('post-comment-content').textContent ?? '';
    // 삭제 버튼
    const $deleteButton = within($mineCommentItem).getByTestId('post-comment-delete-button');
    await userEvent.click($deleteButton);
    // 모달
    const $modal = screen.getByTestId('modal');
    const $deleteConfirmButton = within($modal).getByTestId('modal-delete-button');
    await userEvent.click($deleteConfirmButton);

    // 댓글 수 -1
    await waitFor(() => {
      const $commentCount = screen.getByTestId('post-comment-count');
      expect($commentCount.textContent).toBe(`댓글 ${commentCount - 1}`);
    });

    unmount();
    await flushPromises();
    renderWithProviders(<PostCommentSection type={PostTypes.Notice} postId={1} commentCount={commentCount} />);
    await flushPromises();

    // 리스트에 해당 댓글 없음
    expect(screen.queryByText(comment)).toBeNull();
  });

  it('댓글 수 제한을 넘기면 입력이 제한되고, 토스트 메시지가 보여진다.', async () => {
    const MAX_COMMENT_COUNT = 500;
    renderWithProviders(<PostCommentSection type={PostTypes.Notice} postId={1} commentCount={0} />);

    // 초과되게 입력
    const $commentInput: HTMLInputElement = await screen.findByTestId('post-comment-input');
    const comment = 'a'.repeat(MAX_COMMENT_COUNT + 1);
    // fireEvent.change($commentInput, { target: { value: comment } });
    await userEvent.type($commentInput, comment);
    // 입력이 제한되어야 함
    expect($commentInput.value.length).toBe(MAX_COMMENT_COUNT);

    // 토스트 메시지가 보여야 함
    await screen.findByText(/댓글은 최대 500자까지 입력 가능합니다/);
  });
});
