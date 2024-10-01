const sequelize =require('../Connections/db');
const User = require('./User');
const Owner = require('./Owner');
const Product = require('./Product');
const Cart = require('./Cart');

sequelize.sync({alter:true})
    .then(()=>{
        console.log('All tables created successfully')
    })
    .catch((err)=>{
        console.log('Unable to create tables',err);
    })

module.exports = sequelize;