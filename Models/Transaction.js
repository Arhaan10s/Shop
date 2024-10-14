// const User = require('./User');
// const sequelize = require('../Connections/db')
// const { DataTypes } = require('sequelize')

// const Transaction = sequelize.define('Transaction',{
//     userId:{
//         type: DataTypes.INTEGER,
//         references:{
//             model: User,
//             key:'userId'
//         }
//     },
//     action:{
//         type: DataTypes.ENUM('deposit','withdraw'),
//         defaultValue: 'deposit',
//     },
//     amount:{
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
//     balance:{
//         type: DataTypes.INTEGER,
//         allowNull: true,
//     },
   
// })

// Transaction.belongsTo(User,{foreignKey:'transactionId'});
// User.hasMany(Transaction,{foreignKey:'userId'});

// module.exports = Transaction;