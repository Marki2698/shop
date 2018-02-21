const express = require("express");
const upload = require("multer")();
const mongoose = require("mongoose");
const public_items_managment = require("../managment/public-items");
let router = express.Router();


router.get("/", upload.array(), (req, res, next) => {
    res.render("./public/main");
});

router.get("/get-hot", upload.array(), (req, res, next) => {
    console.log(req.query.names);
    let result = public_items_managment.getHotItems(req.query.names);
    
    let hots = [];
    console.log(result);
    for(let i = 0; i < result.length; i++) {
        console.log(i);
        result[i].then((fullfilled) => {
            hots.push(fullfilled);
        }, (reason) => {
            console.error(reason);
        });
    }

    console.log(hots);
    res.send("ok");
});

module.exports = router;