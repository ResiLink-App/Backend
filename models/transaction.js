const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    tenant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Listing",
      required: true,
    },
    amount: { type: Number, required: true },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },
    paymentReference: { type: String, required: true, unique: true },
    paymentDate: { type: Date },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
