const productStore = {

products:[],

setProducts(products){

this.products =
products;

},

getProducts(){

return this.products;

},

getProductById(id){

return this.products.find(
product =>
product._id === id
);

}

};

window.productStore =
productStore;
