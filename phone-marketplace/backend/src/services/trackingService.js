exports.trackPackage =
async ({
  courier,
  receiptNumber
}) => {

  return {

    status: 'DELIVERED',

    history: [

      {

        title:
          'Paket diterima kurir',

        date:
          new Date()

      },

      {

        title:
          'Paket sedang dikirim',

        date:
          new Date()

      }

    ]

  };

};
