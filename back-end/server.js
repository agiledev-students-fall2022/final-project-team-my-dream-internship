// !/usr/bin/env node
require("dotenv").config();
const mongoose = require("mongoose");
const server = require("./app"); // load up the web server
const port = process.env.PORT; // the port to listen to for incoming requests

// console.log(process.env.MONGO_URI);

// connect to db
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(port, function () {
      console.log(`Connected to MongoDB & Server running on port: ${port}`);
    });
  })
  .catch((error) => {
    console.log(error);
  });

