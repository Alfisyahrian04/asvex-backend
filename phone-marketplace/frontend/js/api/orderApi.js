import {
  request
}
from './api.js';

export const createOrder =
data => {

  return request(
    '/orders',
    {

      method: 'POST',

      headers: {

        'x-idempotency-key':
          crypto.randomUUID()

      },

      body:
        JSON.stringify(data)

    }
  );

};
