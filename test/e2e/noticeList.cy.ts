import { mockLogin } from '../mocks/loign';
import { mockGetNoticeList } from '../mocks/notice';

describe('Notice 리스트 유저 플로우 E2E', () => {
  beforeEach(() => {
    cy.visit('/notices', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        mockLogin(win);
      },
    });

    mockGetNoticeList();
    cy.wait("@GET-Notices")
  });

  it('1. 페이지 진입 시 공지 목록이 렌더링된다', () => {
    cy.get('[data-testid="notice-item"]').should('have.length.at.least', 10);
  })

  it('2. 스크롤 하단 도달 시 다음 공지 목록이 로딩된다', () => {
    cy.get('[data-testid="notice-item"]').should('have.length.at.least', 10);

    // 스크롤 하단 도달
    cy.scrollTo('bottom', {duration: 1000})
    cy.wait('@GET-Notices');

    // 다음 페이지 로드
    cy.get('[data-testid="notice-item"]').should('have.length.least', 20);
  });

  it('3. 공지 카드를 클릭하면 상세 페이지로 이동한다', () => {
    // 첫 번째 공지 카드 클릭
    cy.get('[data-testid="notice-item"]').first().click();

    cy.url().should('match', /\/notices\/\d+$/);
  });
});
