import { NewsDetail } from '@/entities/post/newsDetail';

import { formatTime } from '../../src/shared/lib/times';
import { loginWithFallbackSignup } from '../support/utils/auth';

describe('News 상세 유저 플로우 E2E', () => {
  beforeEach(() => {
    cy.intercept('GET', '/api/v1/news/*').as('GET-NewsDetail');
    cy.intercept('GET', '/api/v1/news/*/comments*').as('GET-NewsComments');
    cy.intercept('PUT', '/api/v1/news/*/likes').as('PUT-NewsLikes');
    cy.intercept('POST', '/api/v1/news/*/comments').as('POST-NewsComment');
    cy.intercept('DELETE', '/api/v1/news/*/comments/*').as('DELETE-NewsComment');

    cy.visit('/news/1', {
      onBeforeLoad(win) {
        loginWithFallbackSignup(win);
      },
    });
  });

  it('1. 뉴스 상세 페이지에 접속하면 상세 정보가 렌더링된다', () => {
    cy.wait('@GET-NewsDetail').then(({ response }) => {
      if (!response) throw new Error('NewsDetail 응답이 없습니다.');
      const initNews = response.body.data;

      // 헤더
      cy.get('[data-testid="post-tag"]').should('contain.text', initNews.tag);
      cy.get('[data-testid="post-title"]').should('have.text', initNews.title);
      cy.get('[data-testid="post-viewCount"]').should('contain.text', initNews.viewCount);
      cy.get('[data-testid="post-createdAt"]').should('have.text', formatTime(initNews.createdAt));

      // 요약
      cy.get('[data-testid="post-summary"]').should('have.text', initNews.summary);

      // 본문
      cy.get('[data-testid="post-content"]', { timeout: 3000 }).contains(initNews.content);

      // 좋아요
      const likeClass = initNews.userLike ? 'bg-secondary-100' : 'bg-gray-100';
      cy.get('[data-testid="like-button"]').should('have.class', likeClass);
      cy.get('[data-testid="like-count"]').should('have.text', `${initNews.likeCount}`);

      // 댓글
      cy.get('[data-testid="post-comment-count"]').should('contain.text', initNews.commentCount);
      cy.get('[data-testid="post-comment-item"]').should('have.length.at.least', Math.min(10, initNews.commentCount));
    });
  });

  it('2. 좋아요 버튼을 클릭하면 좋아요가 토글된다', () => {
    cy.wait('@GET-NewsDetail').then(({ response }) => {
      if (!response) throw new Error('NewsDetail 응답이 없습니다.');

      const initNews: NewsDetail = response.body.data;
      const initialClass = initNews.userLike ? 'bg-secondary-100' : 'bg-gray-100';
      const toggledClass = !initNews.userLike ? 'bg-secondary-100' : 'bg-gray-100';

      cy.get('[data-testid="like-button"]').should('have.class', initialClass);
      cy.get('[data-testid="like-count"]').should('have.text', `${initNews.likeCount}`);

      // 좋아요 클릭
      cy.get('[data-testid="like-button"]').click();
      cy.wait('@PUT-NewsLikes');

      cy.get('[data-testid="like-button"]').should('have.class', toggledClass);
      cy.get('[data-testid="like-count"]').should('have.text', `${initNews.userLike ? Math.max(0, initNews.likeCount - 1) : initNews.likeCount + 1}`);
    });
  });

  it('3. 댓글 입력 후 전송 시 댓글 수가 증가하고 댓글 목록에 추가된다', () => {
    const comment = `테스트 - ${Date.now()}`
    let prevCommentCount = 0;

    // 기존 댓글 수
    cy.get('[data-testid="post-comment-count"]')
      .invoke('text')
      .then((text) => {
        prevCommentCount = parseInt(text.replace(/\D/g, ''), 10); // 숫자만 추출
      });

    // 댓글 작성
    cy.get('[data-testid="post-comment-input"]').type(comment);
    cy.get('[data-testid="post-comment-button"]').click();
    cy.wait('@POST-NewsComment');
    cy.wait('@GET-NewsComments');

    // query 값 갱신 대기
    cy.wait(100)

    // 변경된 댓글 수
    cy.get('[data-testid="post-comment-count"]', )
      .invoke('text')
      .then((text) => {
        const newCount = parseInt(text.replace(/\D/g, ''), 10);
        expect(newCount).to.eq(prevCommentCount + 1);
      });

    // 댓글이 목록에 있는지
    cy.get('[data-testid="post-comment-item"]').contains(comment).should('exist');

    // 작성한 댓글 삭제
    cy.get('[data-testid="post-comment-delete-button"]').first().click();
    cy.get('[data-testid="modal-button-1"]').click();
    cy.wait('@DELETE-NewsComment');
  });

  it('4. 댓글 삭제 시 댓글 수가 감소하고 댓글 목록에서 제거된다', () => {
    const comment = `테스트 - ${Date.now()}`
    let prevCommentCount = 0;

    // 댓글 작성
    cy.get('[data-testid="post-comment-input"]').type(comment);
    cy.get('[data-testid="post-comment-button"]').click();
    cy.wait('@POST-NewsComment');
    cy.wait('@GET-NewsComments');

    // query 값 갱신 대기
    cy.wait(100)

    // 기존 댓글 수
    cy.get('[data-testid="post-comment-count"]')
      .invoke('text')
      .then((text) => {
        prevCommentCount = parseInt(text.replace(/\D/g, ''), 10);
      });

    // 댓글 삭제
    cy.get('[data-testid="post-comment-delete-button"]').first().click();
    cy.get('[data-testid="modal-button-1"]').click();
    cy.wait('@DELETE-NewsComment');
    cy.wait('@GET-NewsComments');

    // query 값 갱신 대기
    cy.wait(100)

    // 변경된 댓글 수
    cy.get('[data-testid="post-comment-count"]')
      .invoke('text')
      .then((text) => {
        const newCount = parseInt(text.replace(/\D/g, ''), 10);
        expect(newCount).to.eq(prevCommentCount - 1);
      });

    // 댓글이 목록에 없는지
    cy.contains('[data-testid="post-comment-item"]', comment).should('not.exist');
  });

  it('5. 댓글 글자 수가 제한 보다 많이 입력되면 입력이 제한된다.', () => {
    const overText = 'a'.repeat(501);

    // 초과 텍스트 입력
    cy.get('[data-testid="post-comment-input"]').type(overText, { delay: 0 });

    // 500자까지만 들어갔는지 확인
    cy.get('[data-testid="post-comment-input"]')
      .invoke('val')
      .then((val) => {
        expect((val as string).length).to.be.eq(500);
      });

    // 토스트 메시지 확인
    cy.contains('메시지는 최대 500자까지 입력 가능합니다.').should('be.visible');
  });
});
