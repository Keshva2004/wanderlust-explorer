const mongoose = require("mongoose");
const Listing = require('../models/listing');
let  MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
const addData = require("./data.js");

main()
.then((res)=>{
    console.log("connected to DB");
}).catch((e)=>{
    console.log(e);
})


async function main(){
    await mongoose.connect(MONGO_URL);
}

const initData = async ()=>{
    await Listing.deleteMany({});
   const OWNER_ID = "687f589dc7211f64a584c13d";
const listingsWithOwner = addData.data.map((listing) => {
    return { ...listing, owner: OWNER_ID };
});

await Listing.insertMany(listingsWithOwner);
    console.log("data was initialized");
}

initData();
