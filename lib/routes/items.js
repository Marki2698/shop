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
    console.log(req.body.category + " is category for images");
    let map_of_images = items_manager.BuildArrayOfImages(req.files);
    let status = items_manager.CreateImageFolder(req.body.category);
    status.then((fulfill) => {
        console.log(fulfill);
        let queue_status = items_manager.BuildQueue(map_of_images, fulfill[0]);
        queue_status.queue.then((success) => {
            console.log(success + " is success");
            //console.log(queue_status.pathes + "is another pathes");
            res.send([queue_status.pathes, fulfill[1]]);
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
    let status = items_manager.CreateItem(JSON.parse(req.body.info), req.body.category, req.body.imgFolder);
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

router.post("/update-item", upload.array("images"), (req, res, next) => {
    console.log(req.body.update);
    let status = items_manager.updateItem(req.body.id, req.body.update, req.body.category, req.body.folder, req.files);
    status.then((fulfill) => {
        res.send(fulfill);
    }, (reason) => {
        console.error(reason);
    });
});

router.post("/remove-admin-items", upload.array(), (req, res, next) => {
    console.log(req.body);
    let info = JSON.parse(req.body.info);
    console.log(JSON.stringify(info) + " info");
    let status = items_manager.removeAdminItems(info.category, info.items);
    status.then((fulfill) => {
        res.send(fulfill);
    }, (reason) => {
        console.error(reason);
        res.send("something went wrong");
    });
});

module.exports = router;