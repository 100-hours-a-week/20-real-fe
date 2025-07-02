import { delay, http, HttpResponse } from 'msw';

import empty from '@test/mocks/post/data/newsList/empty.json';
import hotNewsSuccess from '@test/mocks/post/data/newsList/hotNewsSuccess.json';
import newsSuccess from '@test/mocks/post/data/newsList/newsSuccess.json';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/v1/news`;

export const newsListHandlers = {
  hotNewsSuccess: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(hotNewsSuccess);
    }),
  ],
  newsSuccess: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(newsSuccess);
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
      return HttpResponse.json(newsSuccess);
    }),
  ],
}
