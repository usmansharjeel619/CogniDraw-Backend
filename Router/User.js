const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/Auth");
require("dotenv").config();
const User = require("../Model/User");
const Diagram = require("../Model/Diagram");
const Feedback = require("../Model/Feedback");
const { v4: uuidv4 } = require("uuid");

router.post("/signup", (req, res) => {
  console.log("Hello");
  const data = req.body;
  data.userid = Math.floor(Math.random() * 5000);
  try {
    const user = new User(data);
    user.save();
    res.status(201).json({ success: true, data: user });
  } catch (error) {
    res.status(400).json({ success: false, msg: error });
  }
});

router.post("/login", async (req, res, next) => {
  let { email, password } = req.body;
  let existingUser = await User.findOne({
    email: email,
    password: password,
  });

  if (!existingUser) {
    res.status(401).json({
      success: false,
    });
  } else {
    let token;
    try {
      token = jwt.sign(
        { name: existingUser.name, email: existingUser.email },
        process.env.SECRETKEY,
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new Error(
        "Error! Something went wrong while generating token."
      );
      next(error);
    }
    res.status(200).json({
      success: true,
      data: {
        name: existingUser.name,
        email: existingUser.email,
        userid: existingUser.userid,
        token: token,
      },
    });
  }
});

router.put("/changePassword/:id", async (req, res) => {
  try {
    const editUser = req.params.id;
    const password = req.body.password;

    const updatedUser = await User.updateMany(
      { userid: editUser },
      { password: password }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Failed to update Password" });
  }
});

router.post("/addDiagram", (req, res) => {
  const { image, mycode, diagram } = req.body;

  console.log("image : " + image);
  console.log("pseudocode : " + mycode);
  if (!image || !mycode) {
    return res
      .status(400)
      .json({ message: "Image and pseudocode are required" });
  }

  const newDiagram = new Diagram({
    objectid: uuidv4(),
    title: diagram,
    image: image,
    mycode: mycode,
  });

  newDiagram
    .save()
    .then(() => res.status(201).json({ message: "Diagram saved successfully" }))
    .catch((err) =>
      res.status(500).json({ message: "Error saving diagram", error: err })
    );
});

router.get("/diagrams", async (req, res) => {
  try {
    const allDiagrams = await Diagram.find();

    res.json(allDiagrams);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve Diagram" });
  }
});

router.delete("/deleteDiagram/:id", async (req, res) => {
  try {
    const deleteDiagram = req.params.id;

    const deletedDiagram = await Diagram.deleteOne({
      objectid: deleteDiagram,
    });

    if (!deletedDiagram) {
      return res.status(404).json({ error: "Diagram not found" });
    }

    res.json({ message: "Diagram deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete Diagram" });
  }
});
router.post("/feedback", async (req, res) => {
  const { feedbackData } = req.body;
  console.log(feedbackData);
  try {
    const newFeedback = new Feedback({
      objectid: uuidv4(),
      content: feedbackData,
    });

    await newFeedback.save();
    res
      .status(201)
      .json({ success: true, message: "Feedback submitted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to submit feedback", error });
  }
});
router.get("/diagrams/:objectid", async (req, res) => {
  const { objectid } = req.params;

  try {
    // Find the diagram with the provided objectid
    const diagram = await Diagram.findOne({ objectid });

    if (!diagram) {
      return res.status(404).json({ error: "Diagram not found" });
    }

    // Return the mycode associated with the diagram
    res.json({ mycode: diagram.mycode });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Failed to retrieve mycode", message: error.message });
  }
});

module.exports = router;
