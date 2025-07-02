import { http, HttpResponse } from 'msw';

import commentCreateSuccess from '../data/postCommentCreate/success.json';
import commentDeleteSuccess from '../data/postCommentDelete/success.json';
import commentListSuccess from '../data/postCommentList/success.json';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/v1/notices/:noticeId/comments`;

const currentCommentList = commentListSuccess;

export const postCommentHandler = {
  commentListSuccess: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(currentCommentList);
    }),
  ],
  commentCreateSuccess: [
    http.post(`${API_URL}`, async (req) => {
      const body = await req.request.json() as { content: string };

      currentCommentList.data.items.unshift({
        id: commentListSuccess.data.items[0].id + 1,
        isAuthor: true,
        nickname: 'kevin.joung(정현우)',
        content: body.content,
        profileUrl: "https://www.kakaotech.com/static/images/default_profiles/ryan.jpeg",
        createdAt: "2025.06.12 17:31:30"
      })

      return HttpResponse.json(commentCreateSuccess);
    }),
  ],
  commentDeleteSuccess: [
    http.delete(`${API_URL}/:commentId`, ({params}) => {
      const {commentId} = params

      const indexToDelete = currentCommentList.data.items.findIndex((item) => item.id === Number(commentId));
      if (indexToDelete !== -1) {
        currentCommentList.data.items.splice(indexToDelete, 1);
      }
      return HttpResponse.json(commentDeleteSuccess);
    }),
  ]
}
