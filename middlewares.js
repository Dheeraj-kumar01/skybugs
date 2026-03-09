const Listing = require("./models/listing");
const Review = require("./models/reviews")
const ExpressError = require("./utils/ExpressError");
const {listingSchema} = require("./joiSchema");
const { reviewSchema } = require("./joiSchema");


module.exports.isloggedIn = (req, res, next) =>{
      if(!req.isAuthenticated()){
        // redirect to that page after login..
        req.session.redirectTo = req.originalUrl;
      req.flash("error", "you must be logged in first");
      return res.redirect("/user/login");
    }
    next();
}

module.exports.saveredirectUrl = (req, res, next) =>{
  if(req.session.redirectTo){
    res.locals.redirectTo = req.session.redirectTo;
  }
  next();
}


module.exports.isOwner = async (req, res, next)=>{
      let {id} = req.params;
      let listing = await Listing.findById(id);
      if(!listing.owner.equals( res.locals.currentUser._id)){
        req.flash("error", "Yor are not Owner of this listing.");
        return res.redirect(`/index/${id}`);
      }
      next();
}



module.exports.validateListing = (req, res, next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(error, 400);
    }else{
        next();
    }
}


module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    throw new ExpressError(error, 400);
  } else {
    next();
  }
}; 


module.exports.isReviewAuthor = async (req, res, next)=>{
      let {id, reviewId } = req.params;
      let review = await Review.findById( reviewId);
      if(!review.author.equals( res.locals.currentUser._id)){
        req.flash("error", "Yor are not Owner of this Review.");
        return res.redirect(`/index/${id}`);
      }
      next();
}