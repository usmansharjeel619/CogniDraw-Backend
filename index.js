const { configDotenv } = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

app.use(express.json());
app.use(cors());

configDotenv();

const url = process.env.MONGOURL;
const port = process.env.PORT || 8000;

mongoose
  .connect(url)
  .then(() => {
    console.log("DB Connected");
  })
  .catch((err) => {
    console.log("Not Connected");
  });

const User = require("./Router/User");
app.use(User);

app.get("/hello", (req, res) => {
  res.send("Hello World I am Soban");
});

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
