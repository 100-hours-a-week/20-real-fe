import { delay, http, HttpResponse } from 'msw';

import empty from '../data/noticeList/empty.json';
import success from '../data/noticeList/success.json';
import success_next from '../data/noticeList/success-nextPage.json';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/v1/notices`;

export const noticeListHandlers = {
  success: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(success);
    }),
  ],
  empty: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(empty);
    }),
  ],
  delay: [
    http.get(`${API_URL}`, async () => {
      await delay(300);
      return HttpResponse.json(success);
    }),
  ],
  paginated: [
    http.get(`${API_URL}`, ({ request }) => {
      const url = new URL(request.url);
      const cursorId = url.searchParams.get('cursorId');

      if (!cursorId) {
        // 첫 페이지
        return HttpResponse.json(success);
      }

      // 두 번째 페이지
      return HttpResponse.json(success_next);
    }),
  ]
};
