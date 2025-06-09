const login = async () => {
  return await fetch('/login', {
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
  return await fetch('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      email: Cypress.env('TEST_EMAIL'),
      password: Cypress.env('TEST_PASSWORD'),
      nickname: 'test',
      apiKey: Cypress.env('TEST_API_KEY'),
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

// 로그인 → 실패 시 회원가입 → 재로그인
export const loginWithFallbackSignup = async () => {
  const loginRes = await login();

  if (loginRes.ok) {
    return; // 로그인 성공
  }

  const signupRes = await signup();
  if (!signupRes.ok) {
    throw new Error('회원가입 실패');
  }

  const retryLoginRes = await login();
  if (!retryLoginRes.ok) {
    throw new Error('로그인 재시도 실패');
  }
};
