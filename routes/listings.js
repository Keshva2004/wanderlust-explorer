const express=require("express")
const router = express.Router();
const  asyncWrap = require("../utils/asyncWrap.js");

const Listing = require('../models/listing.js');
const {isLoggedIn , isOwner, validateListings} =  require("../middleware.js");
const { populate } = require("../models/review.js");
const listingController = require("../controller/listing.js");
const multer = require("multer");
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });


//Index route //Create Route
router.route("/")
.get(asyncWrap(listingController.index))
.post(isLoggedIn,
 upload.single('listing[image][url]'),validateListings,
 asyncWrap(listingController.createListing));

 //search route
 router.post("/search", asyncWrap(async (req,res)=>{
    let {country} = req.body;
    const allListings = await Listing.find({country : country})
    if(allListings.length === 0){
        req.flash("error", "No listings found for the selected country.");
        return res.redirect("/listings");
    }
    res.render("listings/index.ejs" , {allListings} );
 }));

 //category filter route
 router.get("/category/:category", asyncWrap(async (req, res) => {
   const category = req.params.category;
   const allListings = await Listing.find({ categories: category });
   if (allListings.length === 0) {
       req.flash("error", "No listings found for the selected category.");
       return res.redirect("/listings");
   }
   res.render("listings/index.ejs", { allListings });
 }));

//new Route
router.get("/new", isLoggedIn , asyncWrap(listingController.randerNewForm));

//show route //update route //delete route
router.route("/:id")
.get(asyncWrap(listingController.showListing))
.put(isLoggedIn,isOwner,upload.single('listing[image][url]'), validateListings,asyncWrap(listingController.updateListing))
.delete(isLoggedIn,isOwner,asyncWrap(listingController.destroyListing))


//edit route
router.get("/:id/edit", isLoggedIn , isOwner ,asyncWrap(listingController.randerEditForm));



module.exports = router;