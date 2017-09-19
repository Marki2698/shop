const crypto = require("crypto");
let config = {
    port: 3000,
    mongoose: {
        base: "mongodb://localhost:27017/materynka",
        catalog: "mongodb://localhost:27017/materynka_catalog"
    },
    secret: crypto.randomBytes(100).toString("utf-8"),
    salt: "asdfhcvyyOIUOIJSALKFHOASDH@32424SDfjSF",
    upload: "./public/images"
}

module.exports = config;