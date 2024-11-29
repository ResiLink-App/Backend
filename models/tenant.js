const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    transactions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
      },
    ],
  },
  { timestamps: true }
);

const Tenant = mongoose.model("Tenant", tenantSchema);
module.exports = Tenant;
