const express = require("express");
const accountRouter = express.Router();
const { authorizeUser } = require("../../middlewares/apiKeyValidator");
const {
  getWalletBalance,
  getUserProfile,
  updateProfile,
  getBusinessProfile,
  updateBusinessProfile,
  checkUserProfileCompletion,
  changePassword,
  addDeliveryAddress,
  editDeliveryAddress,
  deleteDeliveryAddress,
  getDeliveryAddresses,
  getFavorites,
  addProductToFavorites,
} = require("../../controllers/agent/accountController");
const {
  authenticateUser,
} = require("../../middlewares/authenticationMiddleware");
const upload = require("../../middlewares/upload");

accountRouter.get("/profile", authorizeUser, authenticateUser, getUserProfile);

accountRouter.get(
  "/profile/completion",
  authorizeUser,
  authenticateUser,
  checkUserProfileCompletion
);

accountRouter.put(
  "/profile/update",
  authorizeUser,
  authenticateUser,
  upload.single("profilePic"),
  updateProfile
);

accountRouter.post(
  "/password/change",
  authorizeUser,
  authenticateUser,
  changePassword
);

module.exports = accountRouter;
