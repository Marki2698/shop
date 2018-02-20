const express = require("express");
const upload = require("multer")();
let router = express.Router();

router.get("/", upload.array(), (req, res, next) => {
    res.render("./public/main");
});

router.get("/get-hot", upload.array(), (req, res, next) => {
    
});

module.exports = router;