const mongoose = require('mongoose');

const database_schema = new mongoose.Schema({
    game_id: {
      type: Number,
    },
    name: {
      type: String,
    },
    screenshots: {
      type: Object,
    },
    hints: {
      type: Object,
    },
    answers: {
      type: Object,
    },
    reviews: {
      type: Number,
    },
  }, { timestamps: true });
  
const Database = mongoose.model("games_databases", database_schema);

module.exports = Database;
