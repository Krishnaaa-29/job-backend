require("dotenv").config();
require("express-async-errors");
const express = require("express");
const app = express();
//extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");

// error handler
const notFoundMiddleware = require("./middleware/not-found");
const connectDB = require("./db/connect");

//routes
const authRoute = require("./routes/auth");
const jobRoute = require("./routes/jobs");
const authentication = require("./middleware/authentication");

app.use(express.json());
// extra packages
app.use(helmet());
app.use(cors());
app.use(xss());

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 250,
  })
);

// routes
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/jobs", authentication, jobRoute);

app.use(notFoundMiddleware);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    connectDB();
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
