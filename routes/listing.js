const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require('../models/listing.js');
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");
const multer  = require('multer')
const {storage} = require("../cloudconfig.js");
const upload = multer({ storage })
const listingController = require("../controllers/listing.js");

// New router 
router.get("/new", isLoggedIn, listingController.renderNewForm);

// show router 
router.route("/").get(wrapAsync(listingController.index))
.post(isLoggedIn, validateListing,upload.single('listing[image]'), wrapAsync(listingController.createRoute)
);

router.route("/:id")
.get(wrapAsync(listingController.show)
).put(isOwner, isLoggedIn,
upload.single('listing[image]'), validateListing, wrapAsync(listingController.updatelisting)
).delete(isLoggedIn, isOwner, wrapAsync(listingController.deletelisting)
);

// Edit route
router.get("/:id/edit",
    isLoggedIn,isOwner, wrapAsync(listingController.edit)
);

module.exports = router;