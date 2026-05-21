const cloudinary =
require('../config/cloudinary');

exports.uploadImage =
async file => {

  const result =
    await cloudinary
    .uploader
    .upload(file, {

      folder:
        'marketplace'

    });

  return result.secure_url;

};
