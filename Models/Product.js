const sequelize = require('../Connections/db');
const { DataTypes } = require('sequelize');
const Owner = require('./Owner');

// Define the Product model
const Product = sequelize.define('Product', {
    productId: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    image: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    ownerId: {
        type: DataTypes.INTEGER,
        references: {
            model: Owner,
            key: 'ownerId',
        },
    },
});

// Define associations within the Product model
Owner.hasMany(Product, { foreignKey: 'ownerId', as: 'Products' });
Product.belongsTo(Owner, { foreignKey: 'ownerId', as: 'Owner' });

// Export the Product model
module.exports = Product;
