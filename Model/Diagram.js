const mongoose = require("mongoose");

const schema = mongoose.Schema;

const DiagramSchema = new schema(
  {
    objectid: {
      type: String,
      required: false,
    },
    title: {
      type: String,
      required: false,
    },
    image: {
      type: String,
      required: false,
    },
    userid: {
      type: String,
      required: false,
    },
    mycode: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

let Diagram = mongoose.model("Diagram", DiagramSchema);
module.exports = Diagram;
