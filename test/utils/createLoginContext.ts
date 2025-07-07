import { APIRequestContext, Browser, BrowserContext } from '@playwright/test';

export async function createLoginContext(
  user: { email: string; nickname: string; password: string },
  browser: Browser,
  request: APIRequestContext
): Promise<BrowserContext> {
  const baseUrl = process.env.PLAYWRIGHT_BASE_URL!;

  // 1. 회원가입
  await request.post(`${baseUrl}/v1/auth/signup`, {
    data: { ...user, apiKey: process.env.PLAYWRIGHT_API_KEY! },
  });

  // 2. 로그인
  const loginRes = await request.post(`${baseUrl}/v1/auth/login`, {
    data: { email: user.email, password: user.password },
  });
  const { data: loginData } = await loginRes.json();
  const accessToken = loginData.accessToken;

  // 3. context 생성 후 쿠키 주입
  const context = await browser.newContext();
  const page = await context.newPage();
  await context.addCookies([
    {
      name: 'ACCESS_TOKEN_V2',
      value: accessToken,
      domain: 'localhost', // 환경에 맞게 변경
      path: '/',
      sameSite: 'Lax',
      secure: false,
    },
  ]);

  // 4. 유저 정보 조회
  const userRes = await request.get(`${baseUrl}/v1/users/info`, {
    headers: { Cookie: `ACCESS_TOKEN_V2=${accessToken}` },
  });
  const { data: userData } = await userRes.json();

  // 5. 유저 정보 localStorage에 주입
  const userStorageValue = {
    state: {
      user: {
        nickname: userData.nickname,
        role: userData.role,
        profileUrl: userData.profileUrl,
        userId: userData.id,
      },
      isLoggedIn: true,
      isApproved: true,
    },
  };
  await page.addInitScript((value) => {
    localStorage.setItem('user-storage', JSON.stringify(value));
  }, userStorageValue);

  await page.goto(baseUrl);
  await page.close();

  return context;
}
