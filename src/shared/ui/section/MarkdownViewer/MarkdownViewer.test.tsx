import { waitFor } from 'storybook/test';
import { describe, expect, it } from 'vitest';

import { screen } from '@testing-library/dom';
import { render } from '@testing-library/react';

import { MarkdownViewer } from '@/shared/ui/section/MarkdownViewer/MarkdownViewer';

describe('MarkdownViewer', () => {
  it('마크다운이 올바르게 렌더링된다.', () => {
    const { container } = render(
      <MarkdownViewer
        text={`
# h1
## h2
### h3
p
- ul
  - nested ul
1. ol

[a](www.kakaotech.com)
**strong**
| th |
| --- |
| td |

> blockquote
    `}
      />,
    );

    // heading
    expect(screen.getByRole('heading', { level: 1 }).textContent).toBe('h1');
    expect(screen.getByRole('heading', { level: 2 }).textContent).toBe('h2');
    expect(screen.getByRole('heading', { level: 3 }).textContent).toBe('h3');

    // paragraph
    const paragraph = container.querySelector('p');
    expect(paragraph?.textContent?.includes('p')).toBe(true);

    // unordered list
    const ulList = container.querySelectorAll('ul > li');
    expect(ulList.length).toBe(2);
    expect(ulList[0].childNodes[0].textContent).toBe('ul');

    const nestedUlList = container.querySelectorAll('ul > li > ul > li');
    expect(nestedUlList.length).toBe(1);
    expect(nestedUlList[0].textContent).toBe('nested ul');

    // ordered list
    const olList = container.querySelectorAll('ol > li');
    expect(olList.length).toBe(1);
    expect(olList[0].textContent).toBe('ol');

    // link
    const link = screen.getByRole('link', { name: 'a' });
    expect(link?.getAttribute('href')).toBe('www.kakaotech.com');

    // strong
    const strong = container.querySelector('strong');
    expect(strong).not.toBeNull();
    expect(strong?.textContent).toBe('strong');

    // table
    const table = screen.getByRole('table');
    expect(table).toBeTruthy();
    expect(table.querySelector('th')?.textContent).toBe('th');
    expect(table.querySelector('td')?.textContent).toBe('td');

    // blockquote
    const blockquote = container.querySelector('blockquote');
    expect(blockquote).not.toBeNull();

    const blockText = blockquote?.querySelector('p')?.textContent;
    expect(blockText).toBe('blockquote');
  });

  it('줄바꿈이 올바르게 렌더링된다.', async () => {
    render(
      <MarkdownViewer
        text={`
문장1
문장2<br/>문장3
    `}
        useHtml={true}
      />,
    );

    await waitFor(() => {
      expect(document.querySelectorAll('br').length).toBe(2);
    });
  });

  it('마크다운 표 셀 내부에서 br태그로 줄바꿈이 된다.', async () => {
    render(
      <MarkdownViewer
        text={`
| 이름     | 설명                        |
|----------|-----------------------------|
| 기능  | 내용1<br/>내용2  |
    `}
        useHtml={true}
      />,
    );

    await waitFor(() => {
      const td = screen.getByText((_, el) => (el?.tagName === 'TD' && el.textContent?.includes('내용1')) ?? false);
      expect(td?.innerHTML).toContain('<br>');
      expect(td?.textContent).toContain('내용2');
    });
  });

  it('마크다운 표 셀 내부에서 엔터로 줄바꿈이 된다.', async () => {
    render(
      <MarkdownViewer
        text={`
| 이름     | 설명                        |
|----------|-----------------------------|
| 기능    | 내용1
 내용2 |
    `}
        useHtml={true}
      />,
    );

    await waitFor(() => {
      const td = screen.getByText((_, el) => (el?.tagName === 'TD' && el.textContent?.includes('내용1')) ?? false);
      expect(td?.innerHTML).toContain('<br>');
      expect(td?.textContent).toContain('내용2');
    });
  });

  it('HTML을 사용할 때 금지된 태그가 적용되지 않는다.', async () => {
    const { container } = render(
      <MarkdownViewer
        text={`
<script>alert('xss')</script>
<style>body { background: red }</style>
<iframe src="https://test.com" />
<object data="test.swf"></object>
<embed src="test.pdf" />
<form><input type="text" /></form>
`}
        useHtml={true}
      />,
    );

    expect(container.querySelector('script')).toBeNull();
    expect(container.querySelector('style')).toBeNull();
    expect(container.querySelector('iframe')).toBeNull();
    expect(container.querySelector('object')).toBeNull();
    expect(container.querySelector('embed')).toBeNull();
    expect(container.querySelector('form')).toBeNull();
  });
});
