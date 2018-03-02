const express = require("express");
const ex_session = require("express-session");
const session = require("../session/session");
const mongoose = require("mongoose");
const config = require("../config/my_config");
//const panel_manager = require("../managment/admin-panel");
const category_manager = require("../managment/categories");
const connection = require("../mongoose/connection/connection");
const models = require("../mongoose/model/category");
const upload = require("multer")();

let router = express.Router();
//connection.ConnectionBase();

router.get("/get-categories", upload.array(), (req, res, next) => {
    let status = category_manager.getCategories();
    status.then((fulfilled) => {
        if (typeof fulfilled == "boolean") res.send("there are no categories");
        else res.send(fulfilled);
        //next();
    }, (reason) => {
        res.render("./common/message", {
            message: reason
        });
        //next();
    });
});

router.post("/create-category", upload.array(), (req, res, next) => {
    console.log(req.body.name + ": name");
    let status = category_manager.createCategory(req.body.name);
    status.then((fulfilled) => {
        res.send(fulfilled);
    }, (reason) => {
        console.error(reason);
        res.render("./common/message", {
            message: reason
        });
    });
});

router.delete("/remove-category", upload.array(), (req, res, next) => {
    let status = category_manager.removeCategory(req.body.name);
    status.then((fulfilled) => {
        res.send(fulfilled);
    }, (reason) => {
        res.render("./common/message", {
            message: reason
        });
    });
});

module.exports = router;