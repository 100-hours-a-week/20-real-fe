import { beforeEach, describe, expect, it } from 'vitest';

import { globalHandlers } from '@test/mocks/global/handlers/global.handlers';
import mockNoticeList from '@test/mocks/post/data/noticeList/success.json';
import { noticeListHandlers } from '@test/mocks/post/handlers/noticeList.handlers';
import { server } from '@test/msw/server';
import { mockIntersectionObserver } from '@test/utils/mockIntersectionObserver';
import { mockNextNavigation } from '@test/utils/mockNextNavigation';
import { renderWithProviders } from '@test/utils/renderWithProviders';
import { screen } from '@testing-library/dom';

import { NoticeList } from '@/widgets/post/sections/NoticeList/NoticeList';

describe('공지 리스트', () => {
  beforeEach(() => {
    mockNextNavigation();
    mockIntersectionObserver();
  });

  it('정상적으로 공지사항 리스트가 렌더링된다.', async () => {
    server.use(...noticeListHandlers.success);

    renderWithProviders(<NoticeList />);

    for (const item of mockNoticeList.data.items) {
      // 공지사항 아이템 제목
      expect(await screen.findByText(item.title)).toBeTruthy();
    }
  });

  it('로그인이 안된 상태라면 공지사항 리스트 대신 로그인 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.unauthorized);

    renderWithProviders(<NoticeList />);

    // 로그인 Icon
    expect(await screen.findByTestId('unauthorized-error-icon')).toBeTruthy();
  });

  it('인증은 되었지만 권한이 없다면 접근 권한 없음 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.forbidden);

    renderWithProviders(<NoticeList />);

    // 인증X Icon
    expect(await screen.findByTestId('forbidden-error-icon')).toBeTruthy();
  });

  it('예상치 못한 에러 발생 시 에러 안내 문구가 보인다.', async () => {
    server.use(...globalHandlers.unknown);

    renderWithProviders(<NoticeList />);

    // Unknown Icon
    expect(await screen.findByTestId('unknown-error-icon')).toBeTruthy();
  });

  it('공지사항 리스트가 비어 있다면 안내 문구가 보인다.', async () => {
    server.use(...noticeListHandlers.empty);

    renderWithProviders(<NoticeList />);

    // 비어있는 리스트 아이템
    expect(await screen.findByTestId('notice-list-empty')).toBeTruthy();
  });

  it('로딩 중에는 로딩 스피너가 보인다.', async () => {
    server.use(...noticeListHandlers.delay);
    renderWithProviders(<NoticeList />);

    // 로딩 스피너
    expect(await screen.findByTestId('loading-indicator')).toBeTruthy();
  });

  it('공지사항 아이템의 a 태그에 링크가 삽입되어있다.', async () => {
    server.use(...noticeListHandlers.success);

    renderWithProviders(<NoticeList />);

    // 첫번째 아이템
    const targetItem = mockNoticeList.data.items[0];
    const firstItem = await screen.findByText(targetItem.title);

    // 첫번째 아이템의 a 태그에 href가 정상적으로 들어가있는지
    const link = firstItem.closest('a');
    expect(link?.getAttribute('href')).toBe(`/notices/${targetItem.id}`);
  });

  // TODO: 무한 스크롤 테스트 방법 고민 필요...
  // it('스크롤 하면 다음 공지 페이지가 로드된다.', async () => {
  //   server.use(...noticeListHandlers.paginated);
  //
  //   renderWithProviders(<NoticeList />);
  //
  //   const items = await screen.findAllByTestId('notice-list-item');
  //   expect(items).toHaveLength(mockNoticeList.data.items.length);
  //
  //   const allItems = await screen.findAllByTestId('notice-list-item');
  //   expect(allItems).toHaveLength(mockNoticeList.data.items.length + mockNoticeList_nextPage.data.items.length);
  // });
});
