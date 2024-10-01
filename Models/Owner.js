const sequelize  = require('../Connections/db');
const { DataTypes }  = require('sequelize');
// const Product = require('./Product')

const Owner = sequelize.define('Owner',{
    ownerId:{
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull: false
    },
    password:{
        type:DataTypes.STRING,
        allowNull: false
    }
})




module.exports = Owner;