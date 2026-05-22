const user =
JSON.parse(
  localStorage.getItem(
    'user'
  )
);

if (!user) {

  window.location.href =
    './login.html';

}

document.getElementById(
  'profile-name'
).innerText =
  user.name || 'User';

document.getElementById(
  'profile-email'
).innerText =
  user.email || '-';

document.getElementById(
  'logout-btn'
).addEventListener(
  'click',
  () => {

    localStorage.removeItem(
      'token'
    );

    localStorage.removeItem(
      'user'
    );

    alert(
      'Logout berhasil'
    );

    window.location.href =
      './login.html';

  }
);
