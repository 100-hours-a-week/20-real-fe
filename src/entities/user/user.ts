export interface User {
  userId: number;
  nickname: string;
  role: 'OUTSIDER' | 'TRAINEE' | 'STAFF';
  profileUrl: string;
}
