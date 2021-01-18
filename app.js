const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require('node-cron');
const app = express();
const routes = require("./routes");
const getGameDatabase = require("./updateGameDatabase");
const corsOptions = {
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT",
};
require("dotenv/config");

// use Middleware

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(routes);

// connect to MongoDB

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// update game database twice a month at 04:00 AM

cron.schedule('0 4 1,20 * *', () => {
  console.log('starting CRON task...')
  getGameDatabase()
})

// Listen on PORT 3000

app.listen(3000, function () {
  console.log("Example app listening on port 3000!");
});