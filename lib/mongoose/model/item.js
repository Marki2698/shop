const mongoose = require("mongoose");
const Schema = mongoose.Schema;

let ItemSchema = new Schema({
    id: {
        type: Number,
        required: true,
        unique: true
    },
    category: {
        type: String,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    sale: {
        type: Number
    },
    description: {
        type: String,
        required: true
    },
    new: {
        type: Boolean
    },
    hot: {
        type: Boolean
    },
    specification: {
        type: String,
        required: true
    },
    comments: {
        type: []
    },
    images: {
        type: [String]
    }
});


module.exports = mongoose.model("item", ItemSchema, "items");