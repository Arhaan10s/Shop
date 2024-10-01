const express = require('express');
const router = express.Router();
const {registerOwner, signInOwner, getOwner, deleteOwner} = require('../Controllers/ownerControl');
const authentication = require('../Middleware/authenticate');

router.post('/registerOwner', registerOwner);
router.post('/signInOwner', signInOwner);
router.get('/getOwner',authentication, getOwner);
router.delete('/deleteOwner', deleteOwner);

module.exports = router;