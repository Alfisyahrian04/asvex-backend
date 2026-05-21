exports.detectSpam =
message => {

  const blocked = [

    'judi',

    'penipuan'

  ];

  return blocked.some(
    word =>
      message.includes(word)
  );

};
