const sequelize = require('../Connections/db');
const {DataTypes} = require('sequelize');


const User = sequelize.define('User',{
    userId:{
        type:DataTypes.INTEGER,
        autoIncrement:true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    password:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    email:{
        type:DataTypes.STRING,
        allowNull:false,
    },
    usertype:{
        type:DataTypes.ENUM('admin','guest','user'),
        defaultValue:'guest',
    },
    token:{
        type:DataTypes.STRING,
        allowNull:true,
    }
    
    },{
        timestamps:true,
    }

)


module.exports = User;