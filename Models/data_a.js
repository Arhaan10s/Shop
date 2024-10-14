const sequelize = require('../Connections/db');
const { DataTypes } = require('sequelize');

const data_a = sequelize.define('data_a',{
    meta_id:{
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
    },
    data_id:{
        type: DataTypes.INTEGER,
        allowNull: true
    },
    description:{
        type: DataTypes.STRING,
        allowNull: false
    },
    login_id:{
        type: DataTypes.INTEGER,
        allowNull: false
    },
    show_hide:{
        type: DataTypes.INTEGER,
        allowNull: false,
    }
},{
    timestamps:true,
})



module.exports= data_a;