const express = require("express");
const upload = require("multer")();
const mongoose = require("mongoose");
const public_items_managment = require("../managment/public-items");
const public_items_utils = require("../utils/public-items-util");
let router = express.Router();


router.get("/", upload.array(), (req, res, next) => {
    res.render("./public/main");
});

router.get("/get-hot", upload.array(), (req, res, next) => {
    console.log(req.query.names);
    let result = public_items_managment.getHotItems(req.query.names);
    
    //let hots;
    result.then((vals) => {
        console.log(vals.filter(public_items_utils.FilledArray) + " is vals");
        let hots = vals.filter(public_items_utils.FilledArray);
        console.log(...hots + "is hots");
        res.send(...hots);
        //next();
    }, (reason) => {
        console.error(reason);
        res.send(reason);
        //next();
    });
    /* console.log(result + "is result");

    console.log(hots + " is hots");
    res.send("ok"); */
});

module.exports = router;