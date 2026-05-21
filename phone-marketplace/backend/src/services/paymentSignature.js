const crypto =
require('crypto');

module.exports =
(payload, secret) => {

  return crypto

    .createHmac(
      'sha256',
      secret
    )

    .update(payload)

    .digest('hex');

};
