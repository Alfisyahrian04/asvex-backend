const form =
document.getElementById(
  'register-form'
);

form.addEventListener(
  'submit',
  async (e) => {

    e.preventDefault();

    const name =
      document.getElementById(
        'name'
      ).value;

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

          'https://asvex-backend-production.up.railway.app/api/v1/auth/register',

          {

            method: 'POST',

            headers: {

              'Content-Type':
                'application/json'

            },

            body:
              JSON.stringify({

                name,
                email,
                password

              })

          }

        );

      const data =
        await response.json();

      if (data.success) {

        alert(
          'Register berhasil'
        );

        window.location.href =
          './login.html';

      } else {

        alert(
          data.message
          || 'Register gagal'
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
