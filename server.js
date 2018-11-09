const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const people = require('./routes/people')

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("MongoDB Connected."))
  .catch(err => console.log(err));

// Use Routes
app.use("/api/sunshiners", people);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port}`));