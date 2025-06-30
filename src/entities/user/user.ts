export interface User {
  id: number;
  nickname: string;
  role: 'OUTSIDER' | 'TRAINEE' | 'STAFF';
  profileUrl: string;
}
