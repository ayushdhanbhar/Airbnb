const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");


const MONGODB_URL = "mongodb://127.0.0.1:27017/Wanderlust";
main()
    .then(() => {
        console.log("connection done successfully");
    })
    .catch((err) => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGODB_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({
        ...obj,
        owner: "68270983499ac60d76dfbaa0",
    }));
    await Listing.insertMany(initData.data);
    console.log("insert successfully");
};

initDB();