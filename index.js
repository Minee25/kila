require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const path = require("path");
const expressLayouts = require("express-ejs-layouts");
require("./src/database/configDb");

const port = process.env.PORT || 8000;

// View engine
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "src/views"));

app.use(morgan("dev"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Layout
app.use(expressLayouts);
app.set("layout", "layouts/main");

// Routes
app.use("/", require("./src/routes/index"));

// API
app.use("/api/", require("./src/routes/apiRouter"));

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});