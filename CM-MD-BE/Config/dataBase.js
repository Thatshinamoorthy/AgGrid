const mongoose = require('mongoose');

const ConnectDB = ()=>{
    mongoose.connect(process.env.DB_URL,{
        useNewUrlParser:true,
        useUnifiedTopology:true
    }).then((params)=>{
        console.log(params.connection.host);
        console.log("MongoDB Connected..!");
    }).catch(err=>console.log("Error in DB Connection",err))
}

module.exports = ConnectDB;