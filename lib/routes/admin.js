const express = require("express");
const ex_session = require("express-session");
const upload = require("multer")();
const adminManager = require("../managment/admin");
const session = require("../session/session");
const connection = require("../mongoose/connection/connection");
const mongo = require("connect-mongo")(ex_session);
let router = express.Router();

router.get("/admin", upload.array(), (req, res, next) => {
    let adminEnable = adminManager.EnableAdmin();
    adminEnable.then((fulfilled) => {
        if (fulfilled === true) {
            res.render("./admin/admin-login", {
                message: "Admin enable"
            });
        } else {
            res.render("./admin/admin-sign", {
                message: "Admin unable"
            });
        }
        //next();
    }, (reason) => {
        console.error(reason);
    });
});

router.get("/admin-panel", upload.array(), (req, res, next) => {
    if (session.EnableSession(req.session)) {
        res.render("./admin/admin-panel", {
            email: req.session.email
        });
        //next();
    } else {
        res.render("./common/message", {
            message: "something wrong with session"
        });
        //next();
    }
});

router.post("/admin-sign", upload.array(), (req, res, next) => {
    let status = adminManager.CreateAdmin(req.body.email, req.body.password);
    status.then((fulfilled) => {
        if (fulfilled) {
            session.Start(req.session, req.body.email);
            //connection.CloseConnection();
            res.redirect("/admin-panel");
        }
        //next();
    }, (reason) => {
        console.error(reason);
    });
});

router.post("/admin-login", upload.array(), (req, res, next) => {
    let status = adminManager.FindAdmin(req.body.email, req.body.password);
    status.then((fulfilled) => {
        if (fulfilled) {
            session.Start(req.session, req.body.email);
            //connection.CloseConnection();
            res.redirect("/admin-panel");
        } else {
            res.render("./common/message", {
                message: "enter correct email and(or) password"
            });
        }
        //next();
    }, (reason) => {
        console.error(reason);
    });
});

router.post("/admin-logout", upload.array(), (req, res, next) => {
    req.session.destroy();
    /*let status = session.Destroy(req.session);
    status.then((fulfilled) => {
        console.log(fulfilled);
    }, (reason) => {
        console.error(reason);
    });*/
    //session.Destroy(req.session);
    res.redirect("/admin");
});

module.exports = router;