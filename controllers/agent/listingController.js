const { cloudinaryListingUploader } = require("../../middlewares/cloudinary");
const Listing = require("../../models/listing");
const { validateAddListing } = require("../../utils/validation");

exports.addListing = async (req, res, next) => {
  try {
    const { error } = validateAddListing(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        error: error.details.map((detail) => detail.message),
      });
    }
    console.log(req.files);

    if (!req.files) {
      return res.status(400).json({
        status: false,
        error: "Please add the listing images",
      });
    }

    let mediaFiles = {
      images: [],
      // video: ""
    };
    mediaFiles.images = req.files;

    const { title, type, mode, status, price, rooms, location, description } =
      req.body;
    cloudinaryListingUploader(mediaFiles, async (error, uploadedMedia) => {
      if (error) {
        console.error(error);
        return res.status(400).json({
          status: false,
          message: "You've got some errors",
          error: error?.message,
        });
      } else {
        let newListing = new Listing({
          title,
          type,
          mode,
          status,
          price,
          commission: price * 0.05,
          totalPrice: price + price * 0.05,
          rooms,
          location,
          description,
          images: uploadedMedia.images,
          video: "https://youtube.com",
          postedBy: req.user.userId,
        });
        let savedListing = await newListing.save();
        if (savedListing) {
          return res.status(201).json({
            status: true,
            message: "Listing added successfully",
          });
        }
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().populate({
      path: "postedBy",
      select: "_id email profilePic firstName gender lastName phoneNumber",
    }); // Retrieve all listings from the database

    if (!listings || listings.length === 0) {
      return res.status(404).json({
        status: false,
        message: "No listings found.",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Listings retrieved successfully.",
      data: listings, // Include the retrieved listings in the response
    });
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
};

exports.getListingDetails = async (req, res, next) => {
  try {
    const { listingId } = req.params;
    const listing = await Listing.findById(listingId).populate({
      path: "postedBy",
      select: "_id email profilePic firstName gender lastName phoneNumber",
    }); // Retrieve all listings from the database

    return res.status(200).json({
      status: true,
      message: "Listing details retrieved successfully.",
      data: listing, // Include the retrieved listings in the response
    });
  } catch (err) {
    next(err); // Pass any errors to the error handler
  }
};
