const crypto =
require('crypto');

exports.requestReset =
async (req, res) => {

  const token =
    crypto

    .randomBytes(32)

    .toString('hex');

  res.json({

    success: true,

    token

  });

};
