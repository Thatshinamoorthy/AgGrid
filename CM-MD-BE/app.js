const express = require('express');
const app = express();
const cors = require('cors');
const stuRoute = require('./Routes/stuRoutes.js');

app.use(cors());
app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({limit:"10mb",extended:true}));

app.use("/student",stuRoute);
module.exports = app;