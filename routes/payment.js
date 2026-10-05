
const express = require('express');
const router = express.Router();

// कंट्रोलर वाली फाइल को यहाँ मंगा लो
const paymentController = require('../controllers/payment');

const { isLoggedIn } = require("../utils/middleware.js");
router.post('/create-order',isLoggedIn , paymentController.createOrder);
router.post('/verify-payment',isLoggedIn , paymentController.verifyPayment);

module.exports = router;

