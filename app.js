const express = require('express');
const app = express();
const mongoose = require('mongoose');

const port = 8080;


connect()
.then(res => console.log("Connection Sucessfull !"))
.catch(err => console.log("Connection Failed !"));

async function connect(){
  await mongoose.connect('mongodb://127.0.0.1:27017/BookStay')
}

app.get("/",(req,res)=>{
   res.send("Working !");
});

app.listen(port,()=>{
  `Listening at port : ${port}`;
});