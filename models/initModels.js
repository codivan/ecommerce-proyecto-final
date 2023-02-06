const { User } = require('./user.model');
const { Product } = require('./product.model');
const { ProductImgs } = require('./productImgs.model');
const { Category } = require('./categories.model');
const { ProductInCart } = require('./productInCart.model');
const { Cart } = require('./cart.model');
const { Order } = require('./order.model');



const initModels = () => {
	// 1 User <----> M Products
	User.hasMany(Product, { foreignKey: 'userId' });
	Product.belongsTo(User);

	// 1 User <----> M Orders
	User.hasMany(Order, { foreignKey: 'userId' });
	Order.belongsTo(User);

	// 1 user <-----------> 1 cart
	User.hasOne(Cart, {	foreignKey: 'userId'});
	Cart.belongsTo(User);

	// 1 Product <----> M Imgs
	Product.hasMany(ProductImgs, { foreignKey: 'productId' });
	ProductImgs.belongsTo(Product);

	// 1 product <-----------> 1 category
	Category.hasOne(Product);
	Product.belongsTo(Category);

	//1Cart <---------->1 productInCart
	Cart.hasMany(ProductInCart);
	ProductInCart.belongsTo(Cart);
	// 1 cart <-----------> 1 order

	 // 1 Product <--> 1 ProductInCart
	 Product.hasOne(ProductInCart);
	 ProductInCart.belongsTo(Product);

	// 1 Order <----------> 1 Cart
	Cart.hasOne(Order, {foreignKey: 'cartId'});
	Order.belongsTo(Cart);







	

	
	


	

};

 module.exports = { initModels };
