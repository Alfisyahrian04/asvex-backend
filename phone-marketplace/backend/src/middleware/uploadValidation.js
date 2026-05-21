module.exports =
(req, res, next) => {

  const file =
    req.file;

  if (!file) {

    return res.status(400)
    .json({
      success: false,
      message:
        'File wajib diupload'
    });

  }

  const allowed = [

    'image/png',

    'image/jpeg',

    'image/webp'

  ];

  if (
    !allowed.includes(
      file.mimetype
    )
  ) {

    return res.status(400)
    .json({
      success: false,
      message:
        'Format file tidak didukung'
    });

  }

  next();

};
