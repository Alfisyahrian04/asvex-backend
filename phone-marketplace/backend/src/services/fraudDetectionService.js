exports.detectFraud =
({
  transactionCount,
  totalAmount
}) => {

  if (
    transactionCount > 20
  ) {

    return true;

  }

  if (
    totalAmount >
    50000000
  ) {

    return true;

  }

  return false;

};
