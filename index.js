const express = require('express');
const { readdirSync } = require('fs');
const sequelize = require('./Connections/db');
const cors = require('cors');
const dotenv = require('dotenv');
// const Synchronize = require('./Models/Synchronize');

dotenv.config();

const app = express();
const port = 3000;


// Middleware
app.use(express.json());
app.use(cors());


readdirSync('./Routes').map((route) => app.use('/api', require('./Routes/' + route)));


app.listen(port, () => console.log(`Listening on ${port}`));
