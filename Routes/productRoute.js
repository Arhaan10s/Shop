const express = require('express');
const router = express.Router();

const {createProduct, getProduct, deleteProduct, updateProduct} = require('../Controllers/productControl')
const upload = require('../Middleware/upload');
const authentication = require('../Middleware/authenticate');

router.post('/createProduct',authentication,upload.single('image'),createProduct);
router.get('/getProduct',authentication,getProduct);
router.put('/updateProduct',authentication,upload.single('image'),updateProduct);
router.delete('/deleteProduct',authentication,deleteProduct);

module.exports=router;