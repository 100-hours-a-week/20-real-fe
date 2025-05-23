import { generateDummyNewsList } from '../support/mockData/news';
import { mockCursorPagination } from '../support/utils/mockCursorPagination';

export function mockGetNewsList() {
  mockCursorPagination('/v1/news', generateDummyNewsList(30), 'GET-News');
}
