const form =
document.getElementById(
  'login-form'
);

form.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();

    const email =
      document.getElementById(
        'email'
      ).value;

    const password =
      document.getElementById(
        'password'
      ).value;

    try {

      const response =
        await fetch(

          'https://asvex-backend-production.up.railway.app/api/v1/auth/login',

          {

            method: 'POST',

            headers: {

              'Content-Type':
                'application/json'

            },

            body:
              JSON.stringify({

                email,
                password

              })

          }

        );

      const data =
        await response.json();

      if (data.token) {

        localStorage.setItem(
          'token',
          data.token
        );

        localStorage.setItem(
          'user',
          JSON.stringify(
            data.user
          )
        );

        alert(
          'Login berhasil'
        );

        window.location.href =
          './index.html';

      } else {

        alert(
          data.message
          || 'Login gagal'
        );

      }

    } catch (err) {

      console.error(err);

      alert(
        'Server error'
      );

    }

  }
);
