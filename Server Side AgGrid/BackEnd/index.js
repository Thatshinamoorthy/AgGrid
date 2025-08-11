// server.js
const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const DB = require("./Config/dataBase.js");
const users = require("./Models/usersSchema.js");

app.use(cors());
app.use(express.json({limit:"2mb"}));
app.use(express.urlencoded({limit:"10mb",extended:true}));

const getRoute = require('./Routes/getRoute.js')

app.use("/api",getRoute);

DB();
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
