const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const cron = require('node-cron');
const app = express();
const routes = require("./routes");
const getGameDatabase = require("./updateGameDatabase");
const emailjs = require('emailjs-com');
const corsOptions = {
  optionsSuccessStatus: 200,
  methods: "GET, POST, PUT",
};
const fetch = require('node-fetch');
require("dotenv/config");

// e-mail send config



// use Middleware

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(routes);

// connect to MongoDB

mongoose.connect(process.env.DB_CONNECTION, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// emailjs.send("service_shv15zg", "template_t2arx88", {
//   from_name: "Gamergeek REST API",
//   message: "Database connected",
//   reply_to: "cerassus@gmail.com",
// },"user_tAqKspPCvgbXOIGmjkApr");screenLeft

fetch("https://api.emailjs.com/api/v1.0/email/send", {
  headers: {
    "Content-Type": "application/json",
  },
  method: "POST",
  data: JSON.stringify({
    "user_id": "user_tAqKspPCvgbXOIGmjkApr",
    "service_id": "service_shv15zg",
    "template_id": "template_t2arx88",
  }),
})

// update game database twice a month at 04:00 AM

app.listen(3001, function () {
  console.log("Example app listening on port 3000!");
});