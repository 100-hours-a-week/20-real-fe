export interface User {
  nickname: string;
  role: 'OUTSIDER' | 'TRAINEE' | 'STAFF';
  profileUrl: string;
}
