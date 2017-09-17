const mongoose = require("mongoose");
const schema = mongoose.Schema;

let adminSchema = new schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model("admin", adminSchema);