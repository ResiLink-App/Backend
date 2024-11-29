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

exports.validateAddListing = (product) => {
  const schema = Joi.object({
    title: Joi.string().required(),
    type: Joi.string().required(),
    mode: Joi.string().valid("RENT", "SALE").required(),
    price: Joi.number().positive().required(),
    rooms: Joi.number().positive().required(),
    location: Joi.object({
      address: Joi.string().required(),
      city: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
    }).required(),
    description: Joi.string().required(),
  });

  return schema.validate(product);
};

exports.validateProfileUpdate = (details) => {
  const schema = Joi.object({
    firstName: Joi.string().optional(),
    lastName: Joi.string().optional(),
    phoneNumber: Joi.string().optional(),
    whatsapp: Joi.string().valid("Male", "Female").optional(),
  });

  return schema.validate(details);
};

exports.validatePaymentRequest = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    email: Joi.string().email().required(),
    phone: Joi.string().required(),
    listingId: Joi.string().required(),
    amount: Joi.number().required(),
  });

  return schema.validate(data);
};
