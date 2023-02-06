// Models
const { Product  } = require('../models/product.model');
const { Category } = require('../models/categories.model');
const { ProductImgs } = require('../models/productImgs.model');

//utils
const { catchAsync } = require('../utils/catchAsync.util');
const { uploadProductImgs, getProductsImgsUrls } = require('../utils/firebase.util');

const createProduct = catchAsync( async (req, res, next) => {    
    const { sessionUser } = req;

    const { title, description, quantity, price, categoryId } = req.body; 

    const newProduct = await Product.create({ 
        title, 
        description,
        quantity,
        price, 
        categoryId,
        userId: sessionUser.id,         
    });

    await uploadProductImgs(req.files, newProduct.id); 

    res.status(201).json({
        status: 'success',
        data: { newProduct },
    });

});


const getAllProducts = catchAsync( async (req, res, next) => {
    
    const products = await Product.findAll({ 
        where: { status : 'active' },
        include: [
            {model: Category},   
            {model: ProductImgs},         
        ]		
    });

    const productsWithImgs = await getProductsImgsUrls(products);

    res.status(200).json({
        status: 'success',
        data: {
            products: productsWithImgs,                
        },
    });	
});

const getProductById = catchAsync(async (req, res, next) => {	
	const { id } = req.params;

	const products = await Product.findOne({ 
       where: {id, status : 'active' }        
    });   

    res.status(200).json({
        status: 'success',
        data: {products},
    });	
});


const updateProduct = catchAsync(async (req, res, next) => {
	
    const { title, description, price, quantity } = req.body;
    const { product } = req;
    const { sessionUser} = req;

    await product.update({ 
        title,
        description,
        price,
        quantity, 
    });

    res.status(200).json({
        status: 'success',
        data: { product },
    });

});

const deleteProduct = catchAsync(async (req, res, next) => {
	
    const { product } = req; 
    const {sessionUser} = req;   

    await product.update(
        { status: 'deleted' },
        { where: { userId : sessionUser.id } }
        );

    res.status(200).json({
        status: 'success',
    });	
});


module.exports = {
	createProduct,
	getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,   
};