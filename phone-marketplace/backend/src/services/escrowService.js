exports.calculateEscrow =
({
  total
}) => {

  const adminFee =
    total * 0.03;

  const sellerAmount =
    total - adminFee;

  return {

    adminFee,

    sellerAmount

  };

};
