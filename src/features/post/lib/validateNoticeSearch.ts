const MIN_TITLE_LENGTH = 1;
const MAX_TITLE_LENGTH = 30;

const messages = {
  search: {
    tooShort: '검색어를 입력해주세요.',
    tooLong: `최대 ${MAX_TITLE_LENGTH}자까지 검색할 수 있어요.`,
  },
  default: {
    tooShort: '제목은 공백일 수 없어요.',
    tooLong: `제목은 ${MAX_TITLE_LENGTH}자 이하여야 해요.`,
  },
};

export function validateNoticeSearch(title: string, context: 'search' | 'default' = 'default') {
  if (title.length < MIN_TITLE_LENGTH) return messages[context].tooShort;
  if (title.length > MAX_TITLE_LENGTH) return messages[context].tooLong;
  return null;
}
