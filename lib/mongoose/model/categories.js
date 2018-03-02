const mongoose = require("mongoose");
const Schema = mongoose.Schema;

/* let categoriesSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    }
}); */

let categoriesSchema = new Schema({
    categories: {
        type: [String]
    }
});

module.exports = mongoose.model("categories", categoriesSchema);