export function normalizeMarkdown(input?: string): string {
  if (!input) return '';

  return input
    .replace(/\*\*\s*(.*?)\s*\*\*/g, '**$1**') // ** 춘이네 ** 처럼 볼드 문자 시작과 끝이 공백인 경우 공백 제거
    .replace(/~~\s*(.*?)\s*~~/g, '~~$1~~') // ~~ 춘이네 ~~ 처럼 취소선 문자 시작과 끝이 공백인 경우 공백 제거
    .replace(/(?<!~)~(?!~)/g, '&#126;') // ~ 이스케이프
    .replace(
      // 테이블 내에서 줄 바꿈 \n -> <br>
      /(\|.*(?:\n(?!\|).+)*)/g,
      (match) => match.replace(/\n/g, '<br />'),
    );
}
