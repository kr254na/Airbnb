const express = require("express");
const router = express.Router();
const multer = require('multer');
const { storage } = require('../cloudConfig.js');
const upload = multer({ storage});
const wrapAsync = require('../utils/wrapAsync.js');
const { isLoggedIn, isOwner, validateListing } = require('../middleware.js');
const listingController = require("../controllers/listings.js");
router.get("/new", isLoggedIn,listingController.renderNewForm);
router.get('/:id/edit',isLoggedIn,isOwner, wrapAsync(listingController.renderEditForm));
router.route("/")
    .get(wrapAsync(listingController.index))
    .post(isLoggedIn,
        upload.single('image'),
        validateListing,
        wrapAsync(listingController.createListing));
router.route("/:id")
    .get( wrapAsync(listingController.showListing))
.put( isLoggedIn, isOwner,upload.single('image'), validateListing, wrapAsync(listingController.updateListing))
.delete(isLoggedIn,isOwner,wrapAsync(listingController.destroyListing));
module.exports = router;