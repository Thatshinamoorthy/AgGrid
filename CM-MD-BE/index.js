const app = require('./app.js');
const dotenv = require('dotenv');
dotenv.config();
const DataBase = require('./Config/dataBase.js');

DataBase();

app.listen(process.env.PORT,()=>{
    console.log("Server is Running..!");
})