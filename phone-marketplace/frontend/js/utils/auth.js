export function getUser() {

  return JSON.parse(
    localStorage.getItem(
      'user'
    )
  );

}

export function isLoggedIn() {

  return !!localStorage.getItem(
    'token'
  );

}

export function logout() {

  localStorage.removeItem(
    'token'
  );

  localStorage.removeItem(
    'user'
  );

  location.href =
    '/login.html';

}
