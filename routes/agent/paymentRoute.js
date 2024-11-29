const express = require("express");
const paymentRouter = express.Router();
const { authorizeUser } = require("../../middlewares/apiKeyValidator");
const { generatePaymentLink, handlePaymentCallback } = require("../../controllers/agent/paymentController");


paymentRouter.post(
  "/initiate",
  authorizeUser,
  generatePaymentLink
);

paymentRouter.get(
  "/callback",
  handlePaymentCallback
);

module.exports = paymentRouter;
