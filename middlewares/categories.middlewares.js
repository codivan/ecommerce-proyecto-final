// Models
const { Category } = require('../models/categories.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

const categoryExists = catchAsync( async (req, res, next) => {
	
		const { id } = req.params;

		const category = await Category.findOne({ where: { id } });

		if (!category) {
			return (new AppError('Category not found', 404));			
		}

		req.category = category;
		next();	
});
module.exports = { categoryExists };