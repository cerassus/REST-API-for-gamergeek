const mongoose = require('mongoose');

const database_user_score_schema = new mongoose.Schema({
    Name: {
      type: String,
    },
    Score: {
      type: Number,
    },
    Date: {
      type: String,
    },
  });
  
const Scores = mongoose.model("game_results", database_user_score_schema);

module.exports = Scores;

// fetch("http://localhost:3000", {
//   headers: {
//     "Content-Type": "application/json",
//   },
//   method: "POST",
//   body: JSON.stringify({
//     Name: "misiak",
//     Date: "15.12.1999",
//     Score: 15879,
//   }),
// });
