var express = require("express");

var app = express();

//Routes n whatnot

app.use(morgan("dev"));
app.use(bodyParser.json());
































module.exports = app;
