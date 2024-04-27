const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const app = express();
const db = require("./config/keys").mongoURI;
const sensors = require("./routes/api/sensors");
const path = require('path');

mongoose
   .connect(db)
   .then(() => console.log("mongoDB Connected"))
    .catch((err) => console.log(err));

app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//routes
app.use(express.static('public'))
app.use('/api/sensors',sensors);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log("server running on port "+port));