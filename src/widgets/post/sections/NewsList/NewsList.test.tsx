import { beforeEach, describe, expect, it } from 'vitest';

import { globalHandlers } from '@test/mocks/global/handlers/global.handlers';
import mockNewsList from '@test/mocks/post/data/newsList/newsSuccess.json';
import { newsListHandlers } from '@test/mocks/post/handlers/newsList.handlers';
import { server } from '@test/msw/server';
import { mockIntersectionObserver } from '@test/utils/mockIntersectionObserver';
import { renderWithProviders } from '@test/utils/renderWithProviders';
import { screen } from '@testing-library/dom';

import { NewsList } from '@/widgets/post/sections/NewsList/NewsList';

describe('뉴스 리스트', () => {
  beforeEach(() => {
    mockIntersectionObserver();
  });

  it('뉴스가 정상적으로 렌더링된다.', async () => {
    server.use(...newsListHandlers.newsSuccess);
    renderWithProviders(<NewsList />);

    for (const item of mockNewsList.data.items) {
      expect(await screen.findByText(item.title)).toBeTruthy();
    }
  });

  it('로그인이 안된 상태라면 로그인 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.unauthorized);

    renderWithProviders(<NewsList />);

    // 로그인 Icon
    expect(await screen.findByTestId('unauthorized-error-icon')).toBeTruthy();
  });

  it('인증은 되었지만 권한이 없다면 접근 권한 없음 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.forbidden);

    renderWithProviders(<NewsList />);

    // 인증X Icon
    expect(await screen.findByTestId('forbidden-error-icon')).toBeTruthy();
  });

  it('예상치 못한 에러 발생 시 에러 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.unknown);

    renderWithProviders(<NewsList />);

    // Unknown Icon
    expect(await screen.findByTestId('unknown-error-icon')).toBeTruthy();
  });

  it('인기 뉴스 리스트가 비어 있다면 안내 문구가 보인다.', async () => {
    server.use(...newsListHandlers.empty);

    renderWithProviders(<NewsList />);

    // 비어있는 리스트 아이템
    expect(await screen.findByTestId('news-list-empty')).toBeTruthy();
  });
});
