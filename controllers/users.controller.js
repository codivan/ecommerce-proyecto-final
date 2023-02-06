const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

// Models
const { User } = require('../models/user.model');
const { Product } = require('../models/product.model');
const { Order } = require('../models/order.model');
const { Cart } = require('../models/cart.model');
const { ProductInCart } = require('../models/productInCart.model');
const { ProductImg } = require('../models/productImgs.model');


// Utils
const { catchAsync } = require('../utils/catchAsync.util');
const { AppError } = require('../utils/appError.util');

dotenv.config({ path: './config.env' });

// Gen random jwt signs
// require('crypto').randomBytes(64).toString('hex') -> Enter into the node console and paste the command

const createUser = catchAsync(async (req, res, next) => {
	const { username, email, password } = req.body;

	// Encrypt the password
	const salt = await bcrypt.genSalt(12);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = await User.create({
		username,
		email,
		password: hashedPassword,		
	});

	// Remove password from response
	newUser.password = undefined;

	// 201 -> Success and a resource has been created
	res.status(201).json({
		status: 'success',
		data: { newUser },
	});
});


const getAllUsers = catchAsync(async (req, res, next) => {
	const users = await User.findAll({
		attributes: { exclude: ['password'] },
		where: { status: 'active' },
	});

	res.status(200).json({
		status: 'success',
		data: { users },
	});
});

const getUserProducts = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;
	const { user } = req;

	const users = await User.findAll({
		attributes: { exclude: ['password'] },
		where: { status: 'active', id : sessionUser.id },
		include: [
			{model: 				
				Product,
				where:{ userId : sessionUser.id}, 
				required: false, 
			}
		]
	});

	res.status(200).json({
		status: 'success',
		data: { users },
	});
});


const updateUser = catchAsync(async (req, res, next) => {
	const { username, email } = req.body;
	const { user } = req;

	await user.update({ username, email });

	res.status(200).json({
		status: 'success',
		data: { user },
	});
});

const deleteUser = catchAsync(async (req, res, next) => {
	const { user } = req;

	await user.update({ status: 'deleted' });

	res.status(204).json({ 
		status: 'success', 
	});
});


const getUserPurchase = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;
	const { user } = req;

	Cart.findOne({ 
		where: {status: 'active', userId: sessionUser.id}
	})

	if(!cart){
		return next(new AppError('This user does not have a cart',400))
	}

	res.status(200).json({
		status: 'success',
		data: { users },
	});
});

const getUserPurchaseById = catchAsync(async (req, res, next) => {
	const { sessionUser } = req;
	const { user } = req;
	const { id } = req.params;

	const users = await User.findOne({
		attributes: { exclude: ['password'] },
		 where: {id,  status: 'active', id : sessionUser.id}, 
		 include: [
			{model: 
				Order, 
				required: false, 
				include: {
					model: Cart,
					required: false,
					include: {
						model: ProductInCart, 
						required: false,
						include: {
							model: ProductImg,
							required: false,
						}
					}
				}
			}
		]
	});

    res.status(200).json({
        status: 'success',
        data: { users },
    });	
});

const login = catchAsync(async (req, res, next) => {
	// Get email and password from req.body
	const { email, password } = req.body;

	// Validate if the user exist with given email
	const user = await User.findOne({
		where: { email, status: 'active' },
	});

	// Compare passwords (entered password vs db password)
	// If user doesn't exists or passwords doesn't match, send error
	if (!user || !(await bcrypt.compare(password, user.password))) {
		return next(new AppError('Wrong credentials', 400));
	}

	// Remove password from response
	user.password = undefined;

	// Generate JWT (payload, secretOrPrivateKey, options)
	const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
		expiresIn: '30d',
	});

	res.status(200).json({
		status: 'success',
		data: { user, token },
	});
});

module.exports = {
	getAllUsers,
	getUserProducts,
	createUser,
	updateUser,
	deleteUser,
	getUserPurchase,
	getUserPurchaseById,
	login,
};
