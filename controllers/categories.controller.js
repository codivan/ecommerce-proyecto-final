// Models
const { Product  } = require('../models/product.model');
const { Category } = require('../models/categories.model');


//utils
const { catchAsync } = require('../utils/catchAsync.util');


const createCategory = catchAsync( async (req, res, next) => {    

    const { name } = req.body;  

    const newCategory = await Category.create({ 
        name,                
    });

    res.status(201).json({
        status: 'success',
        data: { newCategory },
    });

});


const getCategories = catchAsync( async (req, res, next) => {  
   

     await Category.findAll({ where: {status: 'active'},
include: [
    {model: Product},
]});

    res.status(200).json({
        status: 'success',
        data: { Category },
    });	
});



const updateCategory = catchAsync(async (req, res, next) => {
	
    const {name } = req.body;
    const { category } = req;

    await category.update({ name });

    res.status(200).json({
        status: 'success',
        data: { category },
    });

});

module.exports = {	
    createCategory,
    getCategories,
    updateCategory,
};