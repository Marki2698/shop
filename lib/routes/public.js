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
    let result = public_items_managment.getNewOrHotItems(req.query.names, true, false);
    
    //let hots;
    result.then((vals) => {
        //console.log(vals.filter(public_items_utils.FilledArray) + " is vals");
        let hots = vals.filter(public_items_utils.FilledArray);
        //console.log(hots[0] + "is hots");
        res.send(public_items_utils.FormatArray(hots));
        //next();
    }, (reason) => {
        console.error(reason);
        res.send(reason);
        //next();
    });
});

router.get("/get-new", upload.array(), (req, res, next) => {
    let result = public_items_managment.getNewOrHotItems(req.query.names, false, true);
    
    //let hots;
    result.then((vals) => {
        //console.log(vals.filter(public_items_utils.FilledArray) + " is vals");
        let news = vals.filter(public_items_utils.FilledArray);
        //console.log(...news + "is news");
        res.send(public_items_utils.FormatArray(news));
        //next();
    }, (reason) => {
        console.error(reason);
        res.send(reason);
        //next();
    });
});



router.get("/:category/:id", upload.array(), (req, res, next) => {
    let result = public_items_managment.getItem(req.params.category, req.params.id);
    result.then((fulfilled) => {
        //res.send(fulfilled);
        console.log(fulfilled);
        res.render("./public/item", {
            "name": fulfilled.name,
            "id": req.params.id,
            "category": req.params.category
        });
        //next();
    }, (reason) => {
        console.error(reason);
        res.send(reason);
        //next();
    });
});

router.get("/get-item", upload.array(), (req, res, next) => {
    let result = public_items_managment.getItem(req.query.category, req.query.id);
    result.then((fulfilled) => {
        res.send(fulfilled);
        //next();
    }, (reason) => {
        console.error(reason);
        res.send(reason);
        //next();
    });
});

module.exports = router;