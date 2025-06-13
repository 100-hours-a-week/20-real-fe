import { differenceInDays, differenceInHours, differenceInMinutes, format, parse } from 'date-fns';

export function formatTime(raw?: string): string {
  if (!raw) return '';

  const date = parse(raw, 'yyyy.MM.dd HH:mm:ss', new Date());

  const now = new Date();

  const minutes = differenceInMinutes(now, date);
  const hours = differenceInHours(now, date);
  const days = differenceInDays(now, date);

  if (minutes < 1) return '방금';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;
  try {
    return format(date, 'yyyy.MM.dd');
  } catch (error) {
    console.error(error);
    return raw;
  }
}

export function isRecent(createdAt: string): boolean {
  return differenceInHours(new Date(), parse(createdAt, 'yyyy.MM.dd HH:mm:ss', new Date())) < 24;
}

export function formatToDateString(date: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0');

  const year = date.getFullYear();
  const month = pad(date.getMonth() + 1); // 0-based
  const day = pad(date.getDate());
  const hour = pad(date.getHours());
  const minute = pad(date.getMinutes());
  const second = pad(date.getSeconds());

  return `${year}.${month}.${day} ${hour}:${minute}:${second}`;
}
