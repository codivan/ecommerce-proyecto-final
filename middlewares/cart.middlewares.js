// Models
const { Cart } = require('../models/cart.model');
const { User } = require('../models/user.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');
const { protectSession } = require('../middlewares/auth.middlewares');

const cartExists = catchAsync( async (req, res, next) => {
		const {sessionUser} = req;
		const { userId } = req.params;

		const cart = await Cart.findAll({ where: { userId : sessionUser.id} });

		if (!cart) {
			//return (new AppError('Cart not found', 404));			
			const newCart = Cart.create({userId : sessionUser.id});
			console.log("carrito creado",newCart);
		}
		
		req.newcart = cart;
		next();	
});
module.exports = { cartExists };