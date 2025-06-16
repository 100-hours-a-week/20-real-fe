import { describe, expect, it } from 'vitest';

import { globalHandlers } from '@test/mocks/global/handlers/global.handlers';
import mockHotNewsList from '@test/mocks/post/data/newsList/hotNewsSuccess.json';
import { newsListHandlers } from '@test/mocks/post/handlers/newsList.handlers';
import { server } from '@test/msw/server';
import { renderWithProviders } from '@test/utils/renderWithProviders';
import { screen } from '@testing-library/dom';

import { HotNewsList } from '@/widgets/post/sections/HotNewsList/HotNewsList';

describe('인기 뉴스 리스트', () => {
  it('인기 뉴스가 정상적으로 렌더링된다.', async () => {
    server.use(...newsListHandlers.hotNewsSuccess);
    renderWithProviders(<HotNewsList />);

    for (const item of mockHotNewsList.data.items.slice(0, 2)) {
      expect(await screen.findByText(item.title)).toBeTruthy();
    }
  });

  it('로그인이 안된 상태라면 로그인 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.unauthorized);

    renderWithProviders(<HotNewsList />);

    // 로그인 Icon
    expect(await screen.findByTestId('unauthorized-error-icon')).toBeTruthy();
  });

  it('인증은 되었지만 권한이 없다면 접근 권한 없음 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.forbidden);

    renderWithProviders(<HotNewsList />);

    // 인증X Icon
    expect(await screen.findByTestId('forbidden-error-icon')).toBeTruthy();
  });

  it('예상치 못한 에러 발생 시 에러 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.unknown);

    renderWithProviders(<HotNewsList />);

    // Unknown Icon
    expect(await screen.findByTestId('unknown-error-icon')).toBeTruthy();
  });

  it('인기 뉴스 리스트가 비어 있다면 안내 문구가 보인다.', async () => {
    server.use(...newsListHandlers.empty);

    renderWithProviders(<HotNewsList />);

    // 비어있는 리스트 아이템
    expect(await screen.findByTestId('hot-news-list-empty')).toBeTruthy();
  });

  it('로딩 중에는 로딩 스피너가 보인다.', async () => {
    server.use(...newsListHandlers.delay);
    renderWithProviders(<HotNewsList />);

    // 로딩 스피너
    expect(await screen.findByTestId('hot-news-loading-indicator')).toBeTruthy();
  });
});
