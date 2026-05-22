import {
  request
}
from './api.js';

export const loginApi =
data => {

  return request(
    '/auth/login',
    {

      method: 'POST',

      body:
        JSON.stringify(data)

    }
  );

};

export const registerApi =
data => {

  return request(
    '/auth/register',
    {

      method: 'POST',

      body:
        JSON.stringify(data)

    }
  );

};
