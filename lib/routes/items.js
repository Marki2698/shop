const express = require("express");
const multer = require("multer");
const upload = require("multer")();
const items_manager = require("../managment/items");
const connection = require("../mongoose/connection/connection");
/*let storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "/upload")
    }
});*/
let router = express.Router();

router.get("/get-admin-items", upload.array(), (req, res, next) => {
    // @name - name of category
    console.log(req.query.name);
    let status = items_manager.getItems(req.query.name);
    status.then((fulfill) => {
        res.send(fulfill);
    }, (reason) => {
        console.error(reason);
    });
});

router.get("/get-schema", upload.array(), (req, res, next) => {
    // @name - name of category
    let status = items_manager.getSchema(req.query.name);
    status.then((fulfill) => {
        res.send(fulfill);
    }, (reason) => {
        console.error(reason);
    });
});

router.post("/add-images", upload.array("images"), (req, res, next) => {
    console.log(req.files);
    let map_of_images = items_manager.BuildArrayOfImages(req.files);
    let status = items_manager.CreateImageFolder();
    status.then((fulfill_folder) => {
        console.log(fulfill_folder);
        let queue_status = items_manager.BuildQueue(map_of_images, fulfill_folder);
        queue_status.queue.then((success) => {
            console.log(success + " is success");
            //console.log(queue_status.pathes + "is another pathes");
            res.send(queue_status.pathes);
        }, (failure) => {
            console.error(failure);
        });
        //res.send(fulfill);
    }, (reason) => {
        console.error(reason);
    });
    //res.send("sent");
    //next();
});

router.post("/add-item", upload.array(), (req, res, next) => {
    //multer.
    console.log(req.body.info);
    let status = items_manager.CreateItem(JSON.parse(req.body.info), req.body.category);
    status.then((fulfill) => {
        console.log(fulfill);
    }, (reason) => {
        console.error(reason);
    });
    res.send("sent");
    //next();
});

router.get("/get-admin-item", upload.array(), (req, res, next) => {
    let status = items_manager.getAdminItem(req.query.category, req.query.id);
    status.then((fulfill) => {
        res.send(fulfill);
    }, (reason) => {
        console.error(reason);
    });
    //next();
});

module.exports = router;