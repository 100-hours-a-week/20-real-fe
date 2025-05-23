export function mockLogin(win: Window) {
  win.localStorage.setItem(
    'user-storage',
    JSON.stringify({
      state: {
        user: {
          nickname: 'kevin.joung(정현우)/풀스택',
          role: 'TRAINEE',
          profileUrl: 'https://www.kakaotech.com/static/images/default_profiles/ryan.jpeg',
        },
        isLoggedIn: true,
        isApproved: true,
      },
      version: 0,
    })
  );
}
