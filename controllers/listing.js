const Listing = require("../models/listing");
const axios = require("axios");
//const axios = require('axios'); // legacy way



async function getCoordinates(location) {
  try {

    const response = await axios.get(
      "https://nominatim.openstreetmap.org/search",
      {
        params: {
          q: location,
          format: "json",
          limit: 1
        },
        headers: {
          "User-Agent": "skybug-app"
        }
      }
    );

    if(response.data.length === 0){
      throw new Error("Location not found");
    }

    const data = response.data[0];

    return {
      lat: data.lat,
      lon: data.lon
    };

  } catch (error) {
    console.error("Geocoding Error:", error.message);
    return null;
  }
}







module.exports.update = async (req, res, next) => {
  try {
    let { id } = req.params;
    let list = await Listing.findById(id);
    if (!list) {
      req.flash("error", "Listing you requested for  does not exits");
      return res.redirect("/index");
    }
    let originalImage = list.image.url;
    originalImage = originalImage.replace("/upload", "/upload/w_200,c_fill");
    res.render("listings/update", { list, originalImage });
  } catch (error) {
    next(error);
  }
};

module.exports.index = async (req, res) => {
  let AllListing = await Listing.find({});
  res.render("listings/index.ejs", { AllListing });
};

module.exports.newListingForm = (req, res) => {
  res.render("listings/newListing");
};

module.exports.showListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    let list = await Listing.findById(id)
      .populate({
        path: "reviews",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!list) {
      req.flash("error", "Listing you requested for  does not exits");
      return res.redirect("/index");
    }
    res.render("listings/show", { list });
  } catch (error) {
    next(error);
  }
};

module.exports.createListing = async (req, res, next) => {
  try {
    let url = req.file.path;
    let filename = req.file.filename;
    let newListing = req.body;
    newListing.owner = req.user._id;
    newListing.image = { filename, url };
    let coords = await getCoordinates(req.body.location);
    let cucu = newListing.geometry = {
      type: "Point",
      coordinates: [coords.lon, coords.lat]
    }
    req.flash("success", "Successfully created a new listing");
    await Listing.insertOne(newListing);
    res.redirect("/index");
  } catch (error) {
    next(error);
  }
};

module.exports.editListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    let updateData = req.body;
    let url, filename;
    let coords = await getCoordinates(req.body.location);
    updateData.geometry = {
      type: "Point",
      coordinates: [coords.lon, coords.lat]
    }
    let listing = await Listing.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (req.file) {
      url = req.file.path;
      filename = req.file.filename;
      listing.image = { filename, url };
      await listing.save();
    }

    req.flash("success", "Successfully updated the listing");
    res.redirect(`/index/${id}`);
  } catch (error) {
    next(error);
  }
};

module.exports.deleteListing = async (req, res, next) => {
  try {
    let { id } = req.params;
    req.flash("success", "Successfully deleted the listing");
    await Listing.findByIdAndDelete(id);
    res.redirect("/index");
  } catch (error) {
    next(error);
  }
};
