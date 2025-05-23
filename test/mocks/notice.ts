import { generateDummyNoticeList } from '../support/mockData/notices';
import { mockCursorPagination } from '../support/utils/mockCursorPagination';

export function mockGetNoticeList() {
  mockCursorPagination('/v1/notices', generateDummyNoticeList(30), 'GET-Notices');
}
