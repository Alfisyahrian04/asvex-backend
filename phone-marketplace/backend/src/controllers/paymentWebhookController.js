const crypto =
require('crypto');

exports.midtransWebhook =
async (req, res) => {

  const signature =
    crypto

    .createHash('sha512')

    .update(

      req.body.order_id +

      req.body.status_code +

      req.body.gross_amount +

      process.env
      .MIDTRANS_SERVER_KEY

    )

    .digest('hex');

  if (
    signature !==
    req.body.signature_key
  ) {

    return res.status(403)
    .json({

      success: false,

      message:
        'Invalid signature'

    });

  }

  res.json({
    success: true
  });

};
