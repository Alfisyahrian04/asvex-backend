export const BASE_URL =
'https://asvex-backend-production.up.railway.app/api/v1';

export async function request(
  endpoint,
  options = {}
) {

  const token =
    localStorage.getItem(
      'token'
    );

  const response =
    await fetch(

      `${BASE_URL}${endpoint}`,

      {

        ...options,

        headers: {

          'Content-Type':
            'application/json',

          Authorization:
            token
            ? `Bearer ${token}`
            : ''

        }

      }

    );

  return response.json();

}
