import {
  request
}
from './api.js';

export const getProducts =
() => request('/products');

export const createProduct =
data => {

  return request(
    '/products',
    {

      method: 'POST',

      body:
        JSON.stringify(data)

    }
  );

};
