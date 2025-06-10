import AUTWindow = Cypress.AUTWindow;

const login = async () => {
  return await fetch(Cypress.env('API_URL') + '/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: Cypress.env('TEST_EMAIL'),
      password: Cypress.env('TEST_PASSWORD'),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const signup = async () => {
  return await fetch(Cypress.env('API_URL') + '/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: Cypress.env('TEST_EMAIL'),
      password: Cypress.env('TEST_PASSWORD'),
      nickname: 'test',
      apiKey: Cypress.env('API_KEY'),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

const setLogin = (win: AUTWindow, accessToken: string) => {
  const authState = {
    user: null,
    isLoggedIn: true,
    isApproved: true,
  };

  win.localStorage.setItem('auth', JSON.stringify(authState));
  win.document.cookie = `ACCESS_TOKEN=${accessToken}; path=/;`;
};

// 로그인 → 실패 시 회원가입 → 재로그인
export const loginWithFallbackSignup = async (win: AUTWindow) => {
  const loginRes = await login();

  if (loginRes.ok) {
    const body = await loginRes.json();
    const token = body.data.accessToken;
    setLogin(win, token);
    return;
  }

  const signupRes = await signup();
  if (!signupRes.ok) {
    throw new Error('회원가입 실패');
  }

  const retryLoginRes = await login();
  const body = await retryLoginRes.json();
  const token = body.data.accessToken;
  setLogin(win, token);

  if (!retryLoginRes.ok) {
    throw new Error('로그인 재시도 실패');
  }
};


