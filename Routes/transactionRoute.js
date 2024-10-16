const express = require('express');
const router = express.Router();
const authenticate = require('../Middleware/authenticate');

const{ transactions } = require('../Controllers/transactionControl');

// router.post('/deposit',depositeService );
// router.post('/withdraw',withdrawService );
router.post('/transactions', transactions);

module.exports = router;