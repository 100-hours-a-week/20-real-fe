import { delay, http, HttpResponse } from 'msw';

import empty from '../data/noticeList/empty.json';
import success from '../data/noticeList/success.json';

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
  ]
};
