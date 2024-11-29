const { validatePaymentRequest } = require("../../utils/validation");
const Tenant = require("../../models/tenant");
const Transaction = require("../../models/transaction");
const Listing = require("../../models/listing");
const axios = require("axios");

exports.generatePaymentLink = async (req, res, next) => {
  try {
    const { error } = validatePaymentRequest(req.body);
    if (error) {
      return res.status(400).json({
        status: false,
        error: error.details.map((detail) => detail.message),
      });
    }

    const { firstName, lastName, email, phone, listingId, amount } = req.body;

    // Check if listing exists
    const listing = await Listing.findById(listingId);
    if (!listing) {
      return res.status(404).json({
        status: false,
        message: "Listing not found",
      });
    }

    // Find or create tenant
    let tenant = await Tenant.findOne({ email });
    if (!tenant) {
      tenant = new Tenant({ firstName, lastName, email, phone });
      await tenant.save();
    }

    // Generate a unique payment reference
    const paymentReference = `RESILINK-${Date.now()}-${Math.floor(
      Math.random() * 1000
    )}`;

    // Create transaction record
    const transaction = new Transaction({
      tenant: tenant._id,
      listing: listingId,
      amount,
      paymentReference,
    });
    await transaction.save();

    // Add transaction to tenant's transactions
    tenant.transactions.push(transaction._id);
    await tenant.save();

    // Generate Paystack Payment Link
    const paystackResponse = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // Convert to kobo
        reference: paymentReference,
        callback_url: `${process.env.SERVER_URL}/v1/agent/payment/callback`,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { data } = paystackResponse.data;

    return res.status(201).json({
      status: true,
      message: "Payment link generated successfully",
      data: {
        paymentUrl: data.authorization_url,
        reference: paymentReference,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.handlePaymentCallback = async (req, res, next) => {
  try {
    const { trxref } = req.query;

    // Verify payment
    const paystackResponse = await axios.get(
      `https://api.paystack.co/transaction/verify/${trxref}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        },
      }
    );

    const { data } = paystackResponse.data;

    // Find transaction record
    const transaction = await Transaction.findOne({
      paymentReference: trxref,
    }).populate("tenant");
    if (!transaction) {
      return res.status(404).json({
        status: false,
        message: "Transaction not found",
      });
    }

    if (data.status === "success") {
      transaction.paymentStatus = "SUCCESS";
      transaction.paymentDate = new Date();
      await transaction.save();

      return res.redirect(
        `${process.env.CLIENT_URL}/transaction/status?status=success`
      );
    } else {
      transaction.paymentStatus = "FAILED";
      await transaction.save();

      return res.redirect(
        `${process.env.CLIENT_URL}/transaction/status?status=failure`
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.getTenantTransactions = async (req, res, next) => {
  try {
    const { tenantId } = req.params;

    const tenant = await Tenant.findById(tenantId).populate({
      path: "transactions",
      populate: { path: "listing", select: "title location" },
    });

    if (!tenant) {
      return res.status(404).json({
        status: false,
        message: "Tenant not found",
      });
    }

    return res.status(200).json({
      status: true,
      message: "Transactions retrieved successfully",
      data: tenant.transactions,
    });
  } catch (err) {
    next(err);
  }
};
