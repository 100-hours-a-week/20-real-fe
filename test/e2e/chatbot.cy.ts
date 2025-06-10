import { mockPostChatbot } from '../mocks/chatbot';
import { mockLogin } from '../mocks/loign';
import { mockGetNewsList } from '../mocks/news';
import { mockGetNoticeList } from '../mocks/notice';

describe('Chatbot 유저 플로우 E2E', () => {
  beforeEach(() => {
    cy.visit(`/chatbot`, {
      onBeforeLoad(win) {
        win.localStorage.clear();
        mockLogin(win);
      },
    });

    mockGetNewsList();
    mockGetNoticeList();
  });

  it('1. 추천 질문 클릭 시 챗봇 응답이 렌더링된다', () => {
    mockPostChatbot();

    cy.get('[data-testid="suggested-question"]').first().click();

    cy.wait('@POST-Chatbots');
    cy.contains('에 대한 답변입니다.').should('be.visible');
  });

  it('2. 입력창에 질문 입력 후 전송 시 챗봇 응답이 렌더링된다', () => {
    mockPostChatbot();

    const question = '휴가 신청 방법 알려줘';
    cy.get('[data-testid="chat-input"]').type(question);
    cy.get('[data-testid="send-button"]').click();

    cy.wait('@POST-Chatbots');
    cy.contains(`${question}에 대한 답변입니다.`).should('be.visible');
  });

  it('3. 페이지 진입 시 헤드라인 배너가 렌더링된다', () => {
    cy.wait('@GET-Notices');
    cy.wait('@GET-News');

    cy.contains('1/4').should('be.visible');
    cy.wait(3000);
    cy.contains('2/4').should('be.visible');

  });

  it('4. 챗봇 응답 대기 중 로딩 애니메이션이 표시된다', () => {
    mockPostChatbot(1000);
    const question = '휴가 신청 방법 알려줘';

    cy.get('[data-testid="chat-input"]').type(question);
    cy.get('[data-testid="send-button"]').click();
    cy.get('[data-testid="chat-loading"]').should('be.visible');

    cy.wait('@POST-Chatbots');

    cy.get('[data-testid="chat-loading"]').should('not.exist');
    cy.contains(`${question}에 대한 답변입니다.`).should('be.visible');

  });

  it('5. 질문 글자 수가 제한보다 많이 입력되면 입력이 제한되고 Toast가 보여진다', () => {
    const longText = 'a'.repeat(501);

    cy.get('[data-testid="chat-input"]').type(longText, {delay: 0});

    cy.get('[data-testid="chat-input"]')
      .invoke('val')
      .then((val) => {
        expect((val as string).length).to.be.lte(500);
      });
    cy.contains('메시지는 최대 500자까지 입력 가능합니다.').should('be.visible');
  });
});
