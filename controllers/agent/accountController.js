const { cloudinaryUserPfpUploader } = require("../../middlewares/cloudinary");
const User = require("../../models/user");
const { validatePassword, generateHash } = require("../../utils/bcrypt");
const {
  validateProfileUpdate,
  validatePasswordChange,
} = require("../../utils/validation");

exports.getUserProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    return res.status(200).json({
      status: true,
      message: "User details retrieved successfully",
      user: {
        firstName: user?.firstName,
        lastName: user?.lastName,
        email: user?.email,
        phoneNumber: user?.phoneNumber,
        gender: user?.gender,
        dateOfBirth: user?.dateOfBirth,
        profilePic: user?.profilePic,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const updatedProfile = req.body;

    //   console.log("updatedProfile: ", updatedProfile);

    // Validate the input using Joi
    const { error } = validateProfileUpdate(updatedProfile);
    if (error) {
      return res.status(400).json({
        status: false,
        message: "Validation error",
        error: error.details[0].message,
      });
    }

    // If profilePic is included, handle Cloudinary upload
    if (req.file) {
      const imageFile = req.file.path;
      cloudinaryUserPfpUploader(imageFile, async (error, uploadedImageUrl) => {
        if (error) {
          console.error(error);
          return res.status(400).json({
            status: false,
            message: "You've got some errors",
            error: error?.message,
          });
        } else {
          // Update user's profilePic in the updatedProfile object
          // console.log(uploadedImageUrl);
          updatedProfile.profilePic = uploadedImageUrl.secure_url;

          // Update user profile
          const user = await User.findOneAndUpdate(
            { _id: userId },
            { $set: updatedProfile },
            { new: true }
          );

          if (!user) {
            return res.status(404).json({
              status: false,
              error: "User not found",
            });
          }

          return res.status(200).json({
            status: true,
            message: "Profile updated successfully",
          });
        }
      });
    } else {
      // If no profilePic, just update user profile
      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $set: updatedProfile },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({
          status: false,
          error: "User not found",
        });
      }

      return res.status(200).json({
        status: true,
        message: "Profile updated successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};

exports.checkUserProfileCompletion = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const user = await User.findById(userId, { password: 0 });

    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    const requiredFields = [
      "firstName",
      "lastName",
      "email",
      "phoneNumber",
      "gender",
      "dateOfBirth",
      "profilePic",
    ];

    const filledFields = requiredFields.filter((field) => user[field]);
    const completenessPercent = Math.round(
      (filledFields.length / requiredFields.length) * 100
    );
    const isComplete = completenessPercent === 100;

    return res.status(200).json({
      status: true,
      message: "Profile completeness checked successfully",
      profileCompleteness: {
        percent: completenessPercent,
        isComplete: isComplete,
      },
    });
  } catch (error) {
    next(error);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    const { error } = validatePasswordChange({ oldPassword, newPassword });
    if (error) {
      return res.status(400).json({
        status: false,
        error: error.details.map((detail) => detail.message),
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    const isMatch = validatePassword(oldPassword, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ status: false, error: "Old password is incorrect" });
    }

    const hashedNewPassword = generateHash(newPassword);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({
      status: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};
