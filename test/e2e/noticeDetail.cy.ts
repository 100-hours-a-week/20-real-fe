import { formatTime } from '../../src/shared/lib/times';
import { mockLogin } from '../mocks/loign';
import {
  mockDeleteNoticeComment,
  mockGetNoticeCommentList,
  mockNoticeDetail,
  mockPostNoticeComment,
  mockPutNoticeLike,
} from '../mocks/noticeDetail';
import { dummyNoticeDetail } from '../support/mockData/noticeDetail';

describe('Notice 상세 유저 플로우 E2E', () => {
  beforeEach(() => {
    cy.visit('/notices/1', {
      onBeforeLoad(win) {
        win.localStorage.clear();
        mockLogin(win)
      },
    });

    mockNoticeDetail();
    mockGetNoticeCommentList();
    cy.wait('@GET-NoticeDetail');
    cy.wait('@GET-NoticeComments');
  })

  it('1. 공지 상세 페이지에 접속하면 상세 정보가 렌더링된다', () => {
    const initNotice = dummyNoticeDetail;
    // 헤더
    cy.get('[data-testid="post-tag"]').should('have.text', initNotice.tag);
    cy.get('[data-testid="post-title"]').should('have.text', initNotice.title);
    cy.get('[data-testid="post-author"]').should('contain.text', initNotice.author);
    cy.get('[data-testid="post-createdAt"]').should('have.text', formatTime(initNotice.createdAt));
    // 요약
    cy.get('[data-testid="post-summary"]').should('have.text', initNotice.summary);
    // 본문
    cy.get('[data-testid="notice-content"]', { timeout: 3000 }).contains(initNotice.content);
    // 좋아요
    cy.get('[data-testid="like-button"]').should('have.class', initNotice.userLike ? 'bg-secondary-100' : 'bg-gray-100');
    cy.get('[data-testid="like-count"]').should('have.text', initNotice.likeCount);
    // 댓글
    cy.get('[data-testid="post-comment-count"]').should('contain.text', initNotice.commentCount);
    cy.get('[data-testid="post-comment-item"]').should('have.length.at.least', Math.min(10, initNotice.commentCount));

  })

  it('2. 좋아요 버튼을 클릭하면 좋아요가 토글된다', () => {
    mockPutNoticeLike();

    const initNotice = dummyNoticeDetail;

    cy.get('[data-testid="like-button"]').should('have.class', initNotice.userLike ? 'bg-secondary-100' : 'bg-gray-100');
    cy.get('[data-testid="like-count"]').should('have.text', initNotice.likeCount);

    // 좋아요 클릭
    cy.get('[data-testid="like-button"]').click();
    cy.wait('@PUT-NoticeLike');

    cy.get('[data-testid="like-button"]').should('have.class', !initNotice.userLike ? 'bg-secondary-100' : 'bg-gray-100');
    cy.get('[data-testid="like-count"]').should('have.text', initNotice.likeCount + 1);

    // 좋아요 해제
    cy.get('[data-testid="like-button"]').click();
    cy.wait('@PUT-NoticeLike');

    cy.get('[data-testid="like-button"]').should('have.class', initNotice.userLike ? 'bg-secondary-100' : 'bg-gray-100');
    cy.get('[data-testid="like-count"]').should('have.text', initNotice.likeCount);
  })

  it('3. 댓글 입력 후 전송 시 댓글 수가 증가하고 댓글 목록에 추가된다', () => {
    mockPostNoticeComment();
    const initNotice = dummyNoticeDetail;

    cy.get('[data-testid="post-comment-input"]').type('안녕하새요');
    cy.get('[data-testid="post-comment-button"]').click();
    cy.wait('@POST-NoticeComment');

    cy.wait('@GET-NoticeComments');

    cy.get('[data-testid="post-comment-count"]').should('contain.text', initNotice.commentCount + 1);
  })

  it('4. 댓글 삭제 시 댓글 수가 감소하고 댓글 목록에서 제거된다', () => {
    mockDeleteNoticeComment(30);
    const initNotice = dummyNoticeDetail;

    cy.get('[data-testid="post-comment-delete-button"]').first().click();
    cy.get('[data-testid="modal-button-1"]').click();
    cy.wait('@DELETE-NoticeComment');

    cy.get('[data-testid="post-comment-count"]').should('contain.text', initNotice.commentCount - 1);
  })

  it('5. 댓글 글자 수가 제한 보다 많이 입력되면 입력이 제한된다.', () => {
    cy.get('[data-testid="post-comment-input"]').type('a'.repeat(501), {delay: 0});

    cy.get('[data-testid="post-comment-input"]')
      .invoke('val')
      .then((val) => {
        expect((val as string).length).to.be.lte(500);
      });
    cy.contains('메시지는 최대 500자까지 입력 가능합니다.').should('be.visible');
  })

})
