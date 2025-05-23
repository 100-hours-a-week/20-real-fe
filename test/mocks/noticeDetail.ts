import { dummyNoticeDetail, generateDummyNoticeComments } from '../support/mockData/noticeDetail';
import { mockCursorPagination } from '../support/utils/mockCursorPagination';

export function mockNoticeDetail() {
  cy.intercept('GET', `${Cypress.env('API_URL')}/v1/notices/1`, (req) => {

    req.reply({
      statusCode: 200,
      body: {
        data: dummyNoticeDetail,
      }
    })
  }).as('GET-NoticeDetail')
}

export function mockGetNoticeCommentList() {
  mockCursorPagination('/v1/notices/1/comments', generateDummyNoticeComments(30), 'GET-NoticeComments');
}

export function mockPutNoticeLike() {
  cy.intercept('PUT', `${Cypress.env('API_URL')}/v1/notices/1/likes`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
      }
    })
  }).as('PUT-NoticeLike');
}

export function mockPostNoticeComment() {
  cy.intercept('POST', `${Cypress.env('API_URL')}/v1/notices/1/comments`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
      }
    })
  }).as('POST-NoticeComment');
}

export function mockDeleteNoticeComment(id: number) {
  cy.intercept('DELETE', `${Cypress.env('API_URL')}/v1/notices/1/comments/${id}`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
      }
    })
  }).as('DELETE-NoticeComment');
}
