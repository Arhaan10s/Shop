const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

const sequelize = new Sequelize(
    'shop',
    'postgres',
    'arhaan',
    {
    dialect: 'postgres',
    host:process.env.DB_HOST,
    database:process.env.DB_DATABASE,
    port:process.env.DB_PORT,
    username:process.env.DB_USERNAME,

})

sequelize.authenticate()
    .then(()=>{
    console.log('connected');
    })
    .catch(err=>{
        console.log('Error syncing database',err);
    })

module.exports = sequelize;