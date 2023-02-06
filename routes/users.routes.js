const express = require('express');

// Controllers
const {
	getAllUsers,
	getUserProducts,
	createUser,
	updateUser,
	deleteUser,
	getUserPurchase,
	getUserPurchaseById,
	login,
} = require('../controllers/users.controller');

// Middlewares
const { userExists } = require('../middlewares/users.middlewares');
const { orderExists } = require('../middlewares/orders.middlewares');
const {
	protectSession,
	protectUsersAccount,	
} = require('../middlewares/auth.middlewares');
const {
	createUserValidators,
} = require('../middlewares/validators.middlewares');

const usersRouter = express.Router();

usersRouter.post('/', createUserValidators, createUser);

usersRouter.post('/login', login);

// Protecting below endpoints
usersRouter.use(protectSession);

usersRouter.get('/', getUserProducts);

usersRouter.patch('/:id', userExists, protectUsersAccount, updateUser);

usersRouter.delete('/:id', userExists, protectUsersAccount, deleteUser);

usersRouter.get('/orders', userExists, protectUsersAccount, orderExists,  getUserPurchase);

usersRouter.get('/orders/:id', userExists, protectUsersAccount, getUserPurchaseById);

module.exports = { usersRouter };
