import {
  loginApi
}
from '../api/authApi.js';

const form =
document.getElementById(
  'loginForm'
);

form.addEventListener(
  'submit',
  async e => {

    e.preventDefault();

    const email =
      document.getElementById(
        'email'
      ).value;

    const password =
      document.getElementById(
        'password'
      ).value;

    const response =
      await loginApi({

        email,

        password

      });

    if (
      response.success
    ) {

      localStorage.setItem(
        'token',
        response.token
      );

      localStorage.setItem(
        'user',
        JSON.stringify(
          response.user
        )
      );

      location.href =
        '/index.html';

    } else {

      alert(
        response.message
      );

    }

  }
);
