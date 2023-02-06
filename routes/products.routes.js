const express = require('express');

// Controllers
const {
	getAllProducts,
	createProduct,
	getProductById,
	updateProduct,
	deleteProduct,    
} = require('../controllers/products.controller');

const {
	getCategories,
	createCategory,
	updateCategory,
} = require('../controllers/categories.controller');

// Middlewares
const { productExists } = require('../middlewares/products.middlewares');
const { categoryExists } = require('../middlewares/categories.middlewares');
const {
	 protectSession,
	protectProductAccount,
} = require('../middlewares/auth.middlewares');
const {
	createProductValidators,
} = require('../middlewares/validators.middlewares');

//utils
const { upload } = require('../utils/multer.util');

const productRouter = express.Router();

productRouter.get('/', getAllProducts);
productRouter.get('/:id', getProductById);
productRouter.get('/categories', getCategories);

productRouter.use(protectSession);

productRouter.post('/', upload.array('productImgs', 5),  createProduct);

productRouter.patch('/:id', productExists, protectProductAccount, updateProduct);

productRouter.delete('/:id',  productExists, deleteProduct);



productRouter.post('/categories', createCategory);
 
productRouter.patch('/categories/:id', categoryExists, updateCategory);

module.exports = { productRouter };

