import { mockLogin } from '../mocks/loign';
import { mockGetNewsList } from '../mocks/news';

describe('News 리스트 유저 플로우 E2E', () => {
  beforeEach(() => {
    cy.visit('/news', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        mockLogin(win);
      },
    });

    mockGetNewsList()
  });

  it('1. 페이지 진입 시 뉴스 목록이 렌더링된다', () => {
    cy.wait('@GET-News');

    // 인기 뉴스
    cy.get('[data-testid="hot-news-item"]').should('have.length.at.least', 2);
    // 최신 뉴스
    cy.get('[data-testid="news-item"]').should('have.length.at.least', 10);
  })

  it('2. 스크롤 하단 도달 시 다음 뉴스 목록이 로딩된다', () => {
    cy.wait('@GET-News');

    cy.get('[data-testid="news-item"]').should('have.length.at.least', 10);

    // 스크롤 하단 도달
    cy.scrollTo('bottom', {duration: 1000})
    cy.wait('@GET-News');

    // 다음 페이지 로드
    cy.get('[data-testid="news-item"]').should('have.length.least', 20);
  });

  it('3. 뉴스 카드를 클릭하면 상세 페이지로 이동한다', () => {
    cy.wait('@GET-News');

    // 첫 번째 뉴스 카드 클릭
    cy.get('[data-testid="news-item"]').first().click();

    // URL 이동 확인
    cy.url().should('match', /\/news\/\d+$/);
  });

  it('4. 뉴스 카드를 클릭하면 읽음 처리되고, 읽은 뉴스는 회색으로 보인다', () => {
    cy.wait('@GET-News');

    // 첫 번째 뉴스 카드 클릭
    cy.get('[data-testid="news-item"]').first().click();

    // 다시 /news 페이지로 이동
    cy.visit('/news');
    cy.wait('@GET-News');

    cy.get('[data-testid="news-item-title"]').first().should('have.class', 'text-gray-400')
  })

});
