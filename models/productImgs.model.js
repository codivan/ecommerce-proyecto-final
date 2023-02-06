const { db, DataTypes} = require('../utils/database.util');

const ProductImgs = db.define('productImgs', {
    id:{
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    productId: {
        allowNull: false,
        type: DataTypes.INTEGER,
    },
    imgUrl: {
        allowNull: false,
        type: DataTypes.STRING,
    },
    status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: 'active',
    },
});

module.exports = { ProductImgs };