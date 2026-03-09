const Listing = require("../models/listing");
const Review = require("../models/reviews");


//this is for creating Review
module.exports.createReview = async (req, res, next) => {
  const { id } = req.params;
  const listing = await Listing.findById(id);
  let review = new Review(req.body.review);
  review.author = res.locals.currentUser._id;

  req.flash("success", "Successfully added a new review");
  await review.save();
  listing.reviews.push(review);
  await listing.save();
  res.redirect(`/index/${id}`);
};


//this is for delete review
module.exports.deleteReview = async (req, res, next) => {
  try {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Successfully deleted thereview");
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/index/${id}`);
  } catch (error) {
    next(error);
  }
};
