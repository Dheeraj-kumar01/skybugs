const mongoose = require("mongoose");
const {Schema} = mongoose;


const reviewScheme = new Schema({
    comment: String,
    rating: {
        type: Number,
        min: 1,
        max: 5,
        default: 5
    },
    time: {
        type: Date,
        default: Date.now()
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
})


module.exports = mongoose.model("Review", reviewScheme);