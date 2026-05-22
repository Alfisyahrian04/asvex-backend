exports.isEmail =
email => {

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    .test(email);

};

exports.isStrongPassword =
password => {

  return password.length >= 8;

};
