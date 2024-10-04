const express = require('express');
const router = express.Router();
const {register, signIn, getUser, deleteUser, permissions, logout} = require('../Controllers/userControl');
const authentication = require('../Middleware/authenticate');

router.post('/registerUser', register);
router.post('/signInUser', signIn);
router.post('/logoutUser',authentication,logout)
router.put('/permission', permissions);
router.get('/getUser',authentication, getUser);
router.delete('/deleteUser', deleteUser);

module.exports = router;