const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const review = require('./review.js');
const listingSchema = new Schema({
    title: {
        type: String,
        required:true
    },
    description: {
        type: String
    },
    image: {
        /*filename: {
            type: String,
            default: "listingimage",
            set: (v) => v === "" ? "listingimage" : v
        },
        url: {
            type: String,
            default: "https://images.unsplash.com/photo-1732452792160-c28abdcd4b64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D",
            set: (v) => v === "" ? "https://images.unsplash.com/photo-1732452792160-c28abdcd4b64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxNXx8fGVufDB8fHx8fA%3D%3D" : v
        }*/
        url: String,
        filename:String
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref:"Review"
        }
    ],
    owner: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: {
        type: String,
        enum: ["rooms","amazing pools","farms","camps","iconic citites","castles", "deserts", "farms", "mountains", "arctic"]
    }
});
//Mongoose post-middleware
listingSchema.post("findOneAndDelete", async (listing) => {
    if (listing) {
        await review.deleteMany({ _id: { $in: listing.reviews } });
    }
});
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;