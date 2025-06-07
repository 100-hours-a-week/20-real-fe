export interface BaseResponse<T> {
  code: number;
  message: string;
  data: T;
}

export interface CursorResponse<TItems> {
  nextCursorId: number | null;
  nextCursorStandard: string | null;
  hasNext: boolean;
  items: TItems[];
}

export interface CursorParam {
  cursorId?: number | null;
  cursorStandard?: string | null;
}
