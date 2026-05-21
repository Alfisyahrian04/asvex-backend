exports.syncInventory =
({
  io,
  productId,
  stock
}) => {

  io.emit(
    'inventory-update',
    {

      productId,

      stock

    }
  );

};
