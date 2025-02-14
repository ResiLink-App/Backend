const express = require("express");
const listingRouter = express.Router();
const { authorizeUser } = require("../../middlewares/apiKeyValidator");
const {
  authenticateUser,
} = require("../../middlewares/authenticationMiddleware");
const upload = require("../../middlewares/upload");
const { addListing, getAllListings, getListingDetails, deleteListing} = require("../../controllers/agent/listingController");

listingRouter.post(
  "/add",
  authorizeUser,
  authenticateUser,
  upload.any(),
  addListing
);

listingRouter.get(
  "/all",
  authorizeUser,
  getAllListings
);

listingRouter.get(
  "/:listingId",
  authorizeUser,
  getListingDetails
);
listingRouter.delete("/:listingId", authorizeUser, authenticateUser, deleteListing);

module.exports = listingRouter;
