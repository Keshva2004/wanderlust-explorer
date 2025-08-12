const mongoose = require("mongoose");
const { type } = require("../schema");
let Schema = mongoose.Schema;
const Review = require("./review.js");

let listingSchema = new Schema({
    title:{
        type : String,
        required : true
    },
    description : String,
    image: {
        filename: String,
        url: String
    },
    price:Number,
    location : String,
    country : String,
    reviews :[ {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Review"
    }],
    owner :[ {
        type : mongoose.Schema.Types.ObjectId,
        ref : "User"
    }],
    geoMetry : {
    type: {
      type: String, // Don't do `{ location: { type: String } }`
      enum: ['Point'], // 'location.type' must be 'Point'
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
    categories :{
        type : String,
        enum : ["Trending", "Rooms", "Iconic Cities", "Mountains", "Castles", "Amazing pools", "Camping", "Farms", "Arctic","Play","Boats"],
        required: [true, "Category is required"]
    }
});

listingSchema.post("findOneAndDelete", async(listing)=>{
    if(listing){
    await Review.deleteMany({_id : {$in : listing.reviews}})
    }
})

const Listing = new mongoose.model("Listing" , listingSchema);

module.exports = Listing ; 