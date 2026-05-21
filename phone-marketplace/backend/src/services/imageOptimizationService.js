const sharp =
require('sharp');

exports.optimizeImage =
async buffer => {

  return await sharp(buffer)

    .resize(1200)

    .webp({
      quality: 80
    })

    .toBuffer();

};
