if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");


const cors = require("cors");


const MagicMover=require("./models/magic-mover")

const magicmoverRoute = require("./routes/magicmoverRoute");
const magicitemRoute = require("./routes/magicitemRoute");

const app = express();

app.use(bodyParser.json());

app.use(cors());




app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");

  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, OPTIONS,DELETE,PATCH"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type,Authorizations");
  next();
});

app.use("/magicmover", magicmoverRoute);

app.use("/magicitem",magicitemRoute)



app.use("*", (req, res, next) => {
  res.status(404).json({ message: "this route is not founded" });
});

app.use((error, req, res, next) => {
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;

  console.log(
    "//status" +
      status +
      "///message" +
      message
  );
  res.status(status).json({ message: message, data: data });
});


try {
  mongoose.connect(process.env.MONGO_URL);

  app.listen(process.env.PORT)
    console.log("server listening on port " + process.env.PORT)
 

  
 
} catch (err) {
  console.log(err);
}
