// Import routes
const { app } = require("./app");
const authRouter = require("./routes/agent/authRoute");
const mainRouter = require("./routes/main/mainRoute");

// Import middleware
const errorMiddleware = require("./middlewares/errorMiddleware");
const { notFound } = require("./controllers/main/mainController");
const accountRouter = require("./routes/agent/accountRoute");
const listingRouter = require("./routes/agent/listingRoute");

// Main Routes
app.use(mainRouter);

// Aent Routes
app.use("/v1/agent/auth", authRouter);
app.use("/v1/agent/listing", listingRouter);
app.use("/v1/agent/account", accountRouter);

// Catch-all route for handling 404 not found
app.use(notFound);

// Error middleware
app.use(errorMiddleware);
