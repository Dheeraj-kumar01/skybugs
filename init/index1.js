const mongoose = require("mongoose");
const initData = require("./data.js");
const  Listing = require("../models/listing.js");

main()
.then(res=> console.log("Database connected"))
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wonderluts');
}


const initDB = async ()=>{
   await Listing.deleteMany({});
   initData.data = initData.data.map((prevdata)=>({...prevdata, owner: "69a5805e9d91d719f3121e62"}));
   await Listing.insertMany(initData.data);
   console.log("Data is inisilized");
}

initDB();