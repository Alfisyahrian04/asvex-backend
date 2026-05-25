const cartStore = {

  getCart() {

    return JSON.parse(
      localStorage.getItem('cart')
    ) || [];

  },

  saveCart(cart) {

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

  },

  getProductStock(product) {

    return Number(
      product.stock ||
      product.totalStock ||
      product.quantity ||
      product.qty ||
      0
    );

  },

  addToCart(product) {

    let cart =
      this.getCart();

    const existing =
      cart.find(
        item =>
          item._id === product._id
      );

    const maxStock =
      this.getProductStock(product);

    if (existing) {

      existing.quantity =
        Number(
          existing.quantity || 1
        );

      if (
        maxStock > 0 &&
        existing.quantity >= maxStock
      ) {

        existing.quantity =
          maxStock;

        this.saveCart(cart);

        return false;

      }

      existing.quantity += 1;

      if (
        maxStock > 0 &&
        existing.quantity > maxStock
      ) {

        existing.quantity =
          maxStock;

      }

    } else {

      cart.push({

        ...product,

        quantity: 1

      });

    }

    cart = cart.map(item => {

      const itemStock =
        this.getProductStock(item);

      let qty =
        Number(
          item.quantity || 1
        );

      if (qty < 1) {
        qty = 1;
      }

      if (
        itemStock > 0 &&
        qty > itemStock
      ) {

        qty = itemStock;

      }

      return {

        ...item,

        quantity: qty

      };

    });

    this.saveCart(cart);

    return true;

  },

  removeFromCart(productId) {

    let cart =
      this.getCart();

    cart = cart.filter(

      item =>
        item._id !== productId

    );

    this.saveCart(cart);

  },

  clearCart() {

    localStorage.removeItem(
      'cart'
    );

  },

  getCartCount() {

    const cart =
      this.getCart();

    return cart.reduce(

      (total, item) =>

        total + item.quantity,

      0

    );

  },

  getCartTotal() {

    const cart =
      this.getCart();

    return cart.reduce(

      (total, item) =>

        total + (
          item.price *
          item.quantity
        ),

      0

    );

  }

};

window.cartStore =
  cartStore;
