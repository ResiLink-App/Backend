// Import routes
const { app } = require("./app");
const authRouter = require("./routes/agent/authRoute");
const mainRouter = require("./routes/main/mainRoute");

// Import middleware
const errorMiddleware = require("./middlewares/errorMiddleware");
const { notFound } = require("./controllers/main/mainController");
const accountRouter = require("./routes/agent/accountRoute");
const listingRouter = require("./routes/agent/listingRoute");
const paymentRouter = require("./routes/agent/paymentRoute");

// Main Routes
app.use(mainRouter);

// Agent Routes
app.use("/v1/agent/auth", authRouter);
app.use("/v1/agent/listing", listingRouter);
app.use("/v1/agent/account", accountRouter);
app.use("/v1/agent/payment", paymentRouter);

// Catch-all route for handling 404 not found
app.use(notFound);

// Error middleware
app.use(errorMiddleware);
