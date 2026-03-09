const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const reviews = require("../models/reviews");
const user = require("../models/user");
const { isloggedIn, isOwner, validateListing } = require("../middlewares");
const {
  index,
  update,
  newListingForm,
  showListing,
  createListing,
  editListing,
  deleteListing,
} = require("../controllers/listing");
const multer = require("multer");
const { storage } = require("../cloudinaryConfig");
const upload = multer({ storage });

router
  .route("/")
  .get(index) //index route
  .post(
    isloggedIn,
    validateListing,
    upload.single("image[url]"),
    createListing,
  ); //Create Route

//new route form
router.get("/new", isloggedIn, newListingForm);

//update route
router.get("/:id/update", isloggedIn, update);

router
  .route("/:id")
  .get(showListing) //show route
  .patch(
    isloggedIn,
    upload.single("image[url]"),
    validateListing,
    isOwner,
    editListing,
  ) //Edit Route
  .delete(isloggedIn, deleteListing); //delete route

module.exports = router;
