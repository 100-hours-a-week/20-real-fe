import { v4 as uuidv4 } from 'uuid';

import { BrowserContext, expect, test } from '@playwright/test';
import { createLoginContext } from '@test/utils/createLoginContext';

test.describe.serial('WikiEditor 실시간 협업', () => {
  const userA = {
    email: `${uuidv4()}@test.com`,
    nickname: `${uuidv4()}/테스트`,
    password: `${process.env.PLAYWRIGHT_TEST_PASSWORD}`,
  };

  const userB = {
    email: `${uuidv4()}@test.com`,
    nickname: `${uuidv4()}/테스트`,
    password: `${process.env.PLAYWRIGHT_TEST_PASSWORD_2}`,
  }

  let contextA: BrowserContext;
  let contextB: BrowserContext;

  const wikiTitle = `테스트용-${uuidv4().replace(/-/g, '').slice(0, 20)}`;
  const wikiUrl = `${process.env.PLAYWRIGHT_BROWSER_URL}/wiki/${wikiTitle}`;
  const wikiContent = `${uuidv4()}`

  test.beforeAll(async ({ browser, request }) => {
    contextA = await createLoginContext(userA, browser, request);
    contextB = await createLoginContext(userB, browser, request);
  });

  test.afterAll(async () => {
    await Promise.all([contextA.close(), contextB.close()]);
  });

  test('새로운 문서 생성이 잘 되어야 함', async () => {
    const page = await contextA.newPage();
    await page.goto(wikiUrl);

    // 문서 생성 버튼이 보여야 함
    const createButton = page.getByTestId('create-wiki-button');
    await expect(createButton).toBeVisible();

    // 버튼 클릭
    await createButton.click();

    // 위키 에디터가 나타나야 함
    const editor = page.locator('.simple-editor-content');
    await expect(editor).toBeVisible();

    await page.close();
  })

  test('실시간 동기화가 되어야 함', async () => {
    // 새 페이지 열기
    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await Promise.all([
      pageA.goto(wikiUrl),
      pageB.goto(wikiUrl),
    ]);

    // 에디터가 로드될 때까지 대기
    const editorA = pageA.locator('.simple-editor-content .ProseMirror');
    const editorB = pageB.locator('.simple-editor-content .ProseMirror');

    await Promise.all([
      editorA.waitFor({ timeout: 5000 }),
      editorB.waitFor({ timeout: 5000 }),
    ]);

    // A 페이지에서 텍스트 입력
    await editorA.click();
    await editorA.type(wikiContent);

    // B 페이지에서 해당 텍스트가 반영될 때까지 대기
    await expect(editorB).toContainText(wikiContent, { timeout: 5000 });

    await pageA.close();
    await pageB.close();
  });


  test('기존 문서 로드가 되어야 함', async () => {
    const pageA = await contextA.newPage();
    await pageA.goto(wikiUrl);

    const editorA = pageA.locator('.ProseMirror');
    await editorA.waitFor({ timeout: 5000 })

    // A 에디터에서 입력
    await editorA.click();
    await editorA.type(wikiContent);
    await pageA.waitForTimeout(5000); // 디바운스 저장 대기

    // A 탭 닫기
    await pageA.close();

    const pageB = await contextB.newPage();
    await pageB.goto(wikiUrl);

    const editorB = pageB.locator('.ProseMirror');
    await editorB.waitFor({ timeout: 5000 })

    // B 에디터에 문서 로드가 됐는지
    await expect(editorB).toContainText(wikiContent, { timeout: 5000 });

    await pageB.close();
  })
});
