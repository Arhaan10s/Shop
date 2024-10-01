const express = require('express');
const router = express.Router();

const { addCart, viewCart, removeCart } = require('../Controllers/cartControl');

router.post('/addCart',addCart);
router.get('/viewCart',viewCart);
router.delete('/removeCart',removeCart);


module.exports = router;