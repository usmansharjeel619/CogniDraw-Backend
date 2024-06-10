const mongoose = require("mongoose");

const schema = mongoose.Schema;

const FeedbackSchema = new schema(
  {
    objectid: {
      type: String,
      required: true,
    },
    userid: {
      type: String,
  
    },
    diagramid: {
      type: String,
    
    },
    content: {
      type: String,
   
    },
  },
  {
    timestamps: true,
  }
);

let Feedback = mongoose.model("Feedback", FeedbackSchema);
module.exports = Feedback;
