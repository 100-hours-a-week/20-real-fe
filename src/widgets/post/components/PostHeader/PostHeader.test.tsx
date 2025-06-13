import { describe, expect, it } from 'vitest';

import { render, screen } from '@testing-library/react';

import { formatToDateString } from '@/shared/lib/utils/times';

import { PostHeader } from './PostHeader';

describe('PostHeader', () => {
  it('정상적으로 정보를 렌더링한다.', () => {
    const now = new Date();
    const title = '테스트 제목';
    const author = 'kevin';
    const viewCount = 30;
    const platform = '디스코드';
    const originalUrl = 'https://discord.com';
    const createdAt = formatToDateString(now);

    render(
      <PostHeader
        title={title}
        author={author}
        viewCount={viewCount}
        platform={platform}
        originalUrl={originalUrl}
        createdAt={createdAt}
      />,
    );

    expect(screen.getByText(title)).toBeTruthy();
    expect(screen.getByText('방금')).toBeTruthy();
    expect(screen.getByText(`조회수 ${viewCount}`)).toBeTruthy();
    expect(screen.getByText(author)).toBeTruthy();

    const link = screen.getByRole('link', { name: platform });
    expect(link?.getAttribute('href')).toBe(originalUrl);
  });

  it('방금 생성한 게시글은 최신 태그가 렌더링된다', () => {
    render(<PostHeader title="test" createdAt={formatToDateString(new Date())} />);
    // 최신 태그
    expect(screen.getByText('최신')).toBeTruthy();
  });

  it('24시간 지난 게시글은 최신 태그가 렌더링 되지 않는다.', () => {
    // 24시간 + 1분 전
    const yesterday = new Date(Date.now() - (24 * 60 + 1) * 60 * 1000);
    render(<PostHeader title="test" createdAt={formatToDateString(yesterday)} />);
    // 최신 태그가 없어여 햠
    expect(screen.queryByText('최신')).toBeNull();
  });

  it('태그는 최대 6개까지만 보여진다.', () => {
    render(
      <PostHeader title="test" tags={['1', '2', '3', '4', '5', '6', '7']} createdAt={formatToDateString(new Date())} />,
    );
    // 6개 이하로만 태그가 보여져야 함
    expect(screen.getAllByTestId('post-header-tag').length).toBeLessThanOrEqual(6);
  });
});
