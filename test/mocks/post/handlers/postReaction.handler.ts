import { http, HttpResponse } from 'msw';

import likeSuccess from '@test/mocks/post/data/postReaction/success.json';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/v1/notices/:noticeId/likes`;

export const postReactionHandler = {
  likeSuccess: [
    http.put(`${API_URL}`, () => {
      return HttpResponse.json(likeSuccess);
    }),
  ],
}
