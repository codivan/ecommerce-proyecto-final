// Models
const { Product } = require('../models/product.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const productExists = catchAsync( async (req, res, next) => {
	
		const { id } = req.params;

		const product = await Product.findOne({ where: { id } });

		if (!product) {
			return (new AppError('Product not found', 404));			
		}

		req.product = product;
		next();	
});
module.exports = { productExists };