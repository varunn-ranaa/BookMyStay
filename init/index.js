const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');
const { init } = require('../models/user.js');

connect()
.then(res => console.log("Connection Sucessfull !"))
.catch(err => console.log("Connection Failed !"));


async function connect(){
  await mongoose.connect('mongodb://127.0.0.1:27017/BookStay')
}

const initDB = async function (){
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({
      ...obj, owner : "69c52185e4eb75df7d8b64e5",
    }))
    await Listing.insertMany(initData.data);
    console.log("Data initallized");
}

initDB();
