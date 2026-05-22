const productStore = {

  products: [],

  setProducts(products) {

    this.products = products;

  },

  getProducts() {

    return this.products;

  }

};

export default productStore;
