const cartStore = {

  getCart() {

    return JSON.parse(

      localStorage.getItem(
        'cart'
      ) || '[]'

    );

  },

  addToCart(product) {

    const cart =
      this.getCart();

    cart.push(product);

    localStorage.setItem(
      'cart',
      JSON.stringify(cart)
    );

  },

  clearCart() {

    localStorage.removeItem(
      'cart'
    );

  }

};

export default cartStore;
