module.exports =
requiredFields => {

  return (
    req,
    res,
    next
  ) => {

    for (
      const field
      of requiredFields
    ) {

      if (
        !req.body[field]
      ) {

        return res.status(400)
        .json({

          success: false,

          message:
            `${field} wajib diisi`

        });

      }

    }

    next();

  };

};
