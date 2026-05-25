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

  addToCart(product) {

    let cart =
      this.getCart();

    const existing =
      cart.find(
        item =>
          item._id === product._id
      );

    const maxStock =
      Number(product.stock || 0);

    if (existing) {

      existing.quantity =
        Number(existing.quantity || 1);

      if (
        maxStock > 0 &&
        existing.quantity >= maxStock
      ) {

        existing.quantity =
          maxStock;

      } else {

        existing.quantity += 1;

      }

    } else {

      cart.push({

        ...product,

        quantity:
          maxStock > 0 ? 1 : 1

      });

    }

    cart = cart.map(item => {

      const itemStock =
        Number(item.stock || 0);

      let qty =
        Number(item.quantity || 1);

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
