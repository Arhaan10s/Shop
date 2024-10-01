const sequelize = require('../Connections/db');
const { DataTypes } = require('sequelize');

const User  =  require('./User');
const Product  =  require('./Product');

const Cart  = sequelize.define('Cart',{
    count:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    userId:{
        type:DataTypes.INTEGER,
        references:{
            model:User,
            key:"userId"
        }
    },
    productId:{
        type:DataTypes.INTEGER,
        references:{
            model:Product,
            key:"productId"
        }
    },
},{
    timestamps:true,
})

User.belongsToMany(Product,{through: Cart,foreignKey:'userId'})
Product.belongsToMany(User,{through: Cart,foreignKey:'productId'})

Cart.belongsTo(User,{foreignKey:'userId'})
User.belongsTo(Cart,{foreignKey:'userId'})

Cart.belongsTo(Product,{foreignKey:'productId'})
Product.belongsTo(Cart,{foreignKey:'productId'})

module.exports = Cart;