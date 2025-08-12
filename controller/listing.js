const Listing = require('../models/listing.js');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: process.env.MAPBOX_TOKEN });

// Index - Show all listings
module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index.ejs", { allListings });
};

// New - Render form to create new listing
module.exports.randerNewForm = (req, res) => {
    res.render("listings/new.ejs");
};

// Create - Create a new listing
module.exports.createListing = async (req, res) => {
  let response = await  geocodingClient.forwardGeocode({
  query: req.body.listing.location,
  limit: 1
})
 .send()
    let url = req.file.path;
    let filename = req.file.filename;
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.image = {filename , url}; 
    newListing.geoMetry = response.body.features[0].geometry
    await newListing.save();
    console.log(newListing);
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
};

// Show - Show details of one listing
module.exports.showListing = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id)
        .populate({
            path: "reviews",
            populate: {
                path: "author",
            },
        })
        .populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", { listing });
};

// Edit - Render form to edit listing
module.exports.randerEditForm = async (req, res) => {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested does not exist!");
        return res.redirect("/listings");
    }
    let originalImageUrl = listing.image.url;
    originalImageUrl = originalImageUrl.replace( "/upload" , "/upload/ar_1.0,c_fill,h_250,w_250/bo_5px_solid_lightblue/e_blur:50");

    res.render("listings/edit.ejs", { listing , originalImageUrl });
};

// Update - Update a listing
module.exports.updateListing = async (req, res) => {
    const { id } = req.params;
    let listing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if(typeof req.file !== "undefined") {
    let url = req.file.path;
    let filename = req.file.filename;
    listing.image = { filename, url };
    await listing.save();

    }
   
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
};

// Delete - Delete a listing
module.exports.destroyListing = async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
};