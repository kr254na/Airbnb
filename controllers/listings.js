const { cloudinary } = require('../cloudConfig.js');
const Listing = require("../models/listing")
module.exports.index = async (req, res) => {
    const allListing = await Listing.find({})
    res.render("listings/index.ejs", { allListing });
}
module.exports.renderNewForm = (req, res) => {
    res.render("listings/new.ejs");
};
module.exports.showListing = async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.redirect("/listings");
    }
    console.log(listing);
    res.render("listings/show.ejs", { listing });
};
module.exports.createListing = async (req, res, next) => {
    /*if (!req.body.title || !req.body.description || !req.body.price || !req.body.country || !req.body.location) {
        throw new expressError(400, "Send valid data for listing");
    }*/
    let url = req.file.path;
    let filename = req.file.filename;
    let { title, description, image, price, country, location } = req.body;
    image = { url,filename };
    const newListing = new Listing({ title, description, image, price, country, location });
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New listing created");
    res.redirect('/listings');
};
module.exports.renderEditForm = async (req, res,) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing you requested for does not exist");
        res.render('/listings');
    }
    res.render('listings/edit.ejs', { listing });
};
module.exports.updateListing=async (req, res) => {
    let { id } = req.params;
    /*if (!req.body.title || !req.body.description || !req.body.price || !req.body.country || !req.body.location) {
        throw new expressError(400, "Send valid data for listing");
    }*/
    console.log(req.body);
    const { title, description, price, country, location } = req.body;
    let listing = await Listing.findByIdAndUpdate(id, { title, description, price, country, location });
    if (typeof (req.file) !== "undefined") {
        let index1 = listing.image.url.indexOf('airbnb_DEV');
        let index2 = listing.image.url.lastIndexOf('.');
        console.log(await cloudinary.uploader.destroy(`${listing.image.url.substring(index1,index2)}`));
        let url = req.file.path;
        let filename = req.file.filename;
        listing.image = { filename, url };
        await listing.save();
    }
    req.flash("success", "Listing updated");
    res.redirect(`/listings/${id}`);
};
module.exports.destroyListing = async (req, res) => {
    let deletedListing = await Listing.findByIdAndDelete(req.params.id);
    let index1 = deletedListing.image.url.indexOf('airbnb_DEV');
    let index2 = deletedListing.image.url.lastIndexOf('.');
    try{
    console.log(await cloudinary.uploader.destroy(`${deletedListing.image.url.substring(index1,index2)}`));
    }
    catch(err){
        console.log(err);
    }
    console.log(deletedListing);
    req.flash("error", "Listing deleted");
    res.redirect(`/listings`);
};