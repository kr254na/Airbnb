const mongoose = require('mongoose');
let { initData } = require('./data.js');
const Listing = require("../models/listing.js");
const mongoUrl = 'mongodb://127.0.0.1:27017/wanderlust';
async function main() {
    await mongoose.connect(mongoUrl);
}
main().then(() => {
    console.log('Connected to MongoDB');
})
    .catch((err)=>{
        console.log(err);
    });
const initDB = async () => {
    await Listing.deleteMany({});
    console.log(initData);
    initData= initData.map((obj) =>({ ...obj, owner: "6788cd62a2d61ec829e66978" }));
    await Listing.insertMany(initData);
    console.log("Data initialized");
}
initDB();