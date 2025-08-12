const Review = require("../models/review.js");
const Listing = require("../models/listing.js");


module.exports.destroyReview = async(req,res)=>{
    let {id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{ $pull : {reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","review delete successfully !!");
    res.redirect(`/listings/${id}`);
}

module.exports.createReview = async(req,res) =>{
   const listing = await Listing.findById(req.params.id);
   const newReview = new Review(req.body.review);
   newReview.author = req.user.id;
   listing.reviews.push(newReview);
   await listing.save();
   await newReview.save();
   req.flash("success","review add successfully !!");
   res.redirect(`/listings/${listing._id}`);
}