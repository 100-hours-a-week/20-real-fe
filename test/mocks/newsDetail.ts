import { dummyNewsDetail, generateDummyNewsComments } from '../support/mockData/newsDetail';
import { mockCursorPagination } from '../support/utils/mockCursorPagination';

export function mockNewsDetail() {
  cy.intercept('GET', `${Cypress.env('API_URL')}/v1/news/1`, (req) => {

    req.reply({
      statusCode: 200,
      body: {
        data: dummyNewsDetail,
      }
    })
  }).as('GET-NewsDetail')
}

export function mockGetNewsCommentList() {
  mockCursorPagination('/v1/news/1/comments', generateDummyNewsComments(30), 'GET-NewsComments');
}

export function mockPutNewsLike() {
  cy.intercept('PUT', `${Cypress.env('API_URL')}/v1/news/1/likes`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
      }
    })
  }).as('PUT-NewsLike');
}

export function mockPostNewsComment() {
  cy.intercept('POST', `${Cypress.env('API_URL')}/v1/news/1/comments`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
      }
    })
  }).as('POST-NewsComment');
}

export function mockDeleteNewsComment(id: number) {
  cy.intercept('DELETE', `${Cypress.env('API_URL')}/v1/news/1/comments/${id}`, (req) => {
    req.reply({
      statusCode: 200,
      body: {
      }
    })
  }).as('DELETE-NewsComment');
}
