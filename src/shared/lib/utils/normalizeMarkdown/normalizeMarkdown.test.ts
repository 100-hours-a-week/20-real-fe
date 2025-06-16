import { describe, expect, it } from 'vitest';

import { normalizeMarkdown } from './normalizeMarkdown';

describe('normalizeMarkdown()', () => {
  it('빈 값이 들어오면 빈 값을 리턴한다', () => {
    expect(normalizeMarkdown()).toBe('');
    expect(normalizeMarkdown('')).toBe('');
  });

  it('볼드 기호와 텍스트 사이에 공백이 있으면 제거해서 리턴한다.', () => {
    expect(normalizeMarkdown('**  text  **')).toBe('**text**');
  });

  it('취소선 기호와 텍스트 사이에 공백이 있으면 제거해서 리턴한다.', () => {
    expect(normalizeMarkdown('~~  text  ~~')).toBe('~~text~~');
  });

  it('단일 ~ 문자를 이스케이프 처리해서 리턴한다.', () => {
    expect(normalizeMarkdown('a ~ b')).toBe('a &#126; b');
    expect(normalizeMarkdown('~start')).toBe('&#126;start');
    expect(normalizeMarkdown('end~')).toBe('end&#126;');
  });

  it('여러 ~ 문자가 온다면 이스케이프 처리하지 않고 그대로 리턴한다.', () => {
    expect(normalizeMarkdown('~~strike~~')).toBe('~~strike~~');
    expect(normalizeMarkdown('~~~strike~~~')).toBe('~~~strike~~~');
  });

  it('테이블 셀 내부에서 줄 바꿈이 있을 경우 br 태그로 치환하여 리턴한다.', () => {
    const input = `
| 이름 | 설명 |
| --- | --- |
| 기능1 | 설명1
설명2 |
`;
    const expected = `
| 이름 | 설명 |
| --- | --- |
| 기능1 | 설명1<br />설명2 |
`;
    expect(normalizeMarkdown(input)).toBe(expected);
  });
});
