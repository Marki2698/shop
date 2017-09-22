const express = require("express");
const ex_session = require("express-session");
const session = require("../session/session");
const category_manager = require("../managment/categories");
const connection = require("../mongoose/connection/connection");
const upload = require("multer")();

let router = express.Router();

router.get("/admin-panel/catalog", upload.array(), (req, res, next) => {
    if (session.EnableSession(req.session)) {
        res.render("./admin/admin-panel-catalog", {
            email: req.session.email
        });
        //next();
    } else {
        res.redirect("/admin");
        //next();
    }
});

router.get("/get-categories", upload.array(), (req, res, next) => {
    let status = category_manager.getCategories();
    status.then((fulfilled) => {
        //connection.CloseConnection();
        if (!fulfilled) res.send("there are no categories");
        else res.send(fulfilled);
        //next();
    }, (reason) => {
        connection.CloseConnection();
        res.render("./common/message", {
            message: reason
        });
        //next();
    });
});

router.get("/admin-panel/catalog/:category", upload.array(), (req, res, next) => {
    if (session.EnableSession(req.session)) {
        res.render("./admin/admin-panel-catalog-category", {
            category: req.params.category,
            email: req.session.email
        });
        //next();
    } else {
        res.redirect("/admin");
        //next();
    }

});

router.get("/admin-panel/catalog/:category/new-item", upload.array(), (req, res, next) => {
    if (session.EnableSession(req.session)) {
        res.render("./admin/admin-panel-catalog-category-add", {
            email: req.session.email
        });
        //next();
    } else {
        res.redirect("/admin");
        //next();
    }
});

router.get("/admin-panel/new-category", upload.array(), (req, res, next) => {
    if (session.EnableSession(req.session)) {
        res.render("./admin/admin-panel-new", {
            email: req.session.email
        });
        //next();
    } else {
        res.redirect("/admin");
        //next();
    }
});

router.get("/admin-panel/catalog/:category/:id", upload.array(), (req, res, next) => {
    if (session.EnableSession(req.session)) {
        res.render("./admin/update-item", {
            email: req.session.email,
            title: req.params.category,
            id: req.params.id
        });
    } else {
        res.redirect("/admin");
    }
});


module.exports = router;