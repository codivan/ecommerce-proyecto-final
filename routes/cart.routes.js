const express = require('express');

// Controllers
const {
    createProductInCart,
	updateProductInCart,
    deleteProductInCart,
    createPurchase,   
} = require('../controllers/carts.controller');

// Middlewares
const { cartExists } = require('../middlewares/cart.middlewares');
const {
	 protectSession,
	protectCartAccount,
} = require('../middlewares/auth.middlewares');

const cartRouter = express.Router();

cartRouter.use(protectSession);

cartRouter.post('/add-product', cartExists, createProductInCart);

cartRouter.patch('/update-cart',  updateProductInCart);

cartRouter.delete('/:productId',  deleteProductInCart);

cartRouter.post('/purchase', createPurchase);

module.exports = { cartRouter };