const mongoose = require('mongoose');
const Listing = require('../models/listing.js');
const initData = require('./data.js');

connect()
.then(res => console.log("Connection Sucessfull !"))
.catch(err => console.log("Connection Failed !"));


async function connect(){
  await mongoose.connect('mongodb://127.0.0.1:27017/BookStay')
}

const initDB = async function (){
    await Listing.deleteMany({});
    await Listing.insertMany(initData.data);
    console.log("Data initallized");
}

initDB();
