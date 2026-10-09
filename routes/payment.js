
const express = require('express');
const router = express.Router();


const paymentController = require('../controllers/payment');

const { isLoggedIn } = require("../utils/middleware.js");
router.post('/create-order',isLoggedIn , paymentController.createOrder);
router.post('/verify-payment',isLoggedIn , paymentController.verifyPayment);

module.exports = router;

