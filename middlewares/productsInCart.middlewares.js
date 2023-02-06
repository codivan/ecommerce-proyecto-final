// Models
const { ProductInCart } = require('../models/productInCart.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const productsInCartExists = catchAsync( async (req, res, next) => {
	
		const { id } = req.params;

		const productsInCart = await ProductInCart.findOne({ where: { id } });

		if (!productsInCart) {
			return (new AppError('Cart is empty', 404));			
		}

		req.productsInCart = productsInCart;
		next();	
});
module.exports = { productsInCartExists };