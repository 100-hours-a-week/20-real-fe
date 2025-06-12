import { http, HttpResponse } from 'msw';

import expiredToken from '../data/expiredToken.json';
import forbidden from '../data/forbidden.json';
import forbiddenAdmin from '../data/forbidden-admin.json';
import unauthorized from '../data/unauthorized.json';

const API_URL = `${process.env.NEXT_PUBLIC_API_URL}/*`;

export const globalHandlers = {
  unauthorized: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(unauthorized, { status: 401 });
    }),
  ],
  expiredToken: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(expiredToken, { status: 401 });
    }),
  ],
  forbidden: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(forbidden, { status: 403 });
    }),
  ],
  forbiddenAdmin: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.json(forbiddenAdmin, { status: 403 });
    }),
  ],
  unknown: [
    http.get(`${API_URL}`, () => {
      return HttpResponse.error()
    }),
  ]
};
