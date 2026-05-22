import {
  registerApi
}
from '../api/authApi.js';

const form =
document.getElementById(
  'registerForm'
);

form.addEventListener(
  'submit',
  async e => {

    e.preventDefault();

    const username =
      document.getElementById(
        'username'
      ).value;

    const email =
      document.getElementById(
        'email'
      ).value;

    const password =
      document.getElementById(
        'password'
      ).value;

    const response =
      await registerApi({

        username,

        email,

        password

      });

    if (
      response.success
    ) {

      alert(
        'Register berhasil'
      );

      location.href =
        '/login.html';

    } else {

      alert(
        response.message
      );

    }

  }
);
