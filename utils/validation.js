const Joi = require("joi");
const { default: mongoose } = require("mongoose");

exports.validateSignUp = (details) => {
  const signUpSchema = Joi.object({
    firstName: Joi.string().trim().required(),
    lastName: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  });

  return signUpSchema.validate(details);
};

exports.validateEmailVerify = (details) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
    verificationCode: Joi.string().trim().length(6).required(),
  });

  return schema.validate(details);
};

exports.validateSignIn = (details) => {
  const signInSchema = Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().required(),
  });

  return signInSchema.validate(details);
};

exports.validatePhoneVerification = (details) => {
  const verificationSchema = Joi.object({
    verificationCode: Joi.string().required(),
    phoneNumber: Joi.string()
      .trim()
      .regex(/^\+[0-9]+$/)
      .required(),
  });

  return verificationSchema.validate(details);
};

exports.validateEmail = (details) => {
  const schema = Joi.object({
    email: Joi.string().trim().email().required(),
  });

  return schema.validate(details);
};

exports.validateOtp = (details) => {
  const otpSchema = Joi.object({
    verificationCode: Joi.string().trim().length(6).required(),
  });

  return otpSchema.validate(details);
};

exports.validateResetPassword = (details) => {
  const resetPasswordSchema = Joi.object({
    password: Joi.string().required(),
    verificationCode: Joi.string().trim().length(6).required(),
  });

  return resetPasswordSchema.validate(details);
};

exports.validateProfileUpdate = (details) => {
  const schema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    gender: Joi.string().valid("Male", "Female").optional(),
  });

  return schema.validate(details);
};

exports.validateBusinessProfileUpdate = (details) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    about: Joi.string().optional(),
    address: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
  });

  return schema.validate(details);
};

exports.validatePasswordChange = (data) => {
  const schema = Joi.object({
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  });
  return schema.validate(data);
};

exports.addAddressValidation = (data) => {
  const addressSchema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phoneNumber: Joi.string().required(),
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
  });
  return addressSchema.validate(data);
};

exports.editAddressValidation = (details) => {
  const addressSchema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    street: Joi.string().optional(),
    city: Joi.string().optional(),
    state: Joi.string().optional(),
  });
  return addressSchema
    .keys({
      addressId: Joi.string()
        .custom((value, helpers) => {
          if (!mongoose.Types.ObjectId.isValid(value)) {
            return helpers.message("Invalid address ID");
          }
          return value;
        })
        .required(),
    })
    .validate(details);
};

exports.deleteAddressValidation = (details) => {
  const schema = Joi.object({
    addressId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid chat ID");
        }
        return value;
      })
      .required(),
  });
  return schema.validate(details);
};

exports.validateAppealCreation = (appeal) => {
  const schema = Joi.object({
    orderId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid order ID");
        }
        return value;
      })
      .required(),
    subject: Joi.string().required(),
  });

  return schema.validate(appeal);
};

exports.validateProduct = (product) => {
  const schema = Joi.object({
    video: Joi.string().required(),
    shippingAddress: Joi.object({
      city: Joi.string().required(),
      state: Joi.string().required(),
    }).required(),
    location: Joi.object({
      city: Joi.string().required(),
      state: Joi.string().required(),
    }).required(),
    title: Joi.string().required(),
    condition: Joi.string().valid("New", "Fairly Used").required(),
    negotiable: Joi.boolean().required(),
    totalPrice: Joi.number().required(),
    price: Joi.number().required(),
    bulkPrice: Joi.object({
      quantity: Joi.number().required(),
      price: Joi.number().required(),
    }).required(),
    delivery: Joi.object({
      city: Joi.string().required(),
      estimatedTime: Joi.string().required(),
    }).required(),
    shippingOptions: Joi.array()
      .items(
        Joi.string().valid("Waybill", "Courier Service", "Dispatch Service")
      )
      .default(["Available"]),
    categoryId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid category ID");
        }
        return value;
      })
      .required(),
    subCategory: Joi.string().required(),
    gender: Joi.string().valid("Male", "Female", "Unisex").required(),
    color: Joi.array().required(),
    description: Joi.string().required(),
  });

  return schema.validate(product);
};

exports.validateCategoryCreate = (data) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    subCategories: Joi.array().required(),
  });

  return schema.validate(data);
};

exports.validateProductSearchQuery = (query) => {
  const schema = Joi.object({
    title: Joi.string().optional(),
    category: Joi.string().optional(),
    subCategory: Joi.string().optional(),
    minPrice: Joi.number().min(0).optional(),
    maxPrice: Joi.number().min(0).optional(),
    condition: Joi.string().valid("New", "Fairly Used").optional(),
    location: Joi.string().optional(),
    gender: Joi.string().valid("Male", "Female", "Unisex").optional(),
  });

  return schema.validate(query);
};

exports.vaidateProductId = (details) => {
  const schema = Joi.object({
    productId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid Product ID");
        }
        return value;
      })
      .required(),
  });
  return schema.validate(details);
};

exports.vaidateProductFlag = (details) => {
  const schema = Joi.object({
    productId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid Product ID");
        }
        return value;
      })
      .required(),
    reason: Joi.string().min(5).max(500).required(),
  });
  return schema.validate(details);
};

exports.vaidateProductId = (details) => {
  const schema = Joi.object({
    productId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid Product ID");
        }
        return value;
      })
      .required(),
  });
  return schema.validate(details);
};

exports.vaidateReview = (details) => {
  const schema = Joi.object({
    rating: Joi.number().min(1).max(5).required(),
    comment: Joi.string().required(),
    productId: Joi.string()
      .custom((value, helpers) => {
        if (!mongoose.Types.ObjectId.isValid(value)) {
          return helpers.message("Invalid Product ID");
        }
        return value;
      })
      .required(),
  });
  return schema.validate(details);
};
