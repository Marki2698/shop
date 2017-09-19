const connection = require("../mongoose/connection/connection");
const mongoose = require("mongoose");
const models = require("../mongoose/model/category");
const categories = require("../mongoose/model/categories");
const config = require("../config/my_config");
const fs = require("fs");

function getItems(name) {
    connection.ConnectionBase();
    let mymodel = models.getCategoryModel(name);
    return new Promise((resolve, reject) => {
        mymodel.then((fulfilled) => {
            if (typeof fulfilled === "string") {
                resolve(fulfilled + ", something went wrong");
            } else {
                mongoose.connection.model(name).find((err, docs) => {
                    if (err) reject(err);
                    else {
                        if (docs.length === 0) {
                            resolve("empty category");
                        } else {
                            resolve(docs);
                        }
                    }
                });
            }
        }, (reason) => {
            reject(reason);
        });
    });
}

function BuildItemData(obj) {

}

function getSchema(category) {
    connection.ConnectionBase();
    //console.log(category + "is category");
    return new Promise((resolve, reject) => {
        categories.findOne({
            name: category
        }, (err, res) => {
            if (err) reject(err);
            else {
                //console.log(res + "is response");
                let schema = JSON.parse(res.category);
                //console.log(JSON.stringify(schema) + " is schema");
                let fields = {};
                for (let key in schema) {
                    //console.log(key);
                    if (key === "comment" || key === "id") {;
                    } else {
                        //console.log(key, schema[key]["type"]);
                        fields[key] = {
                            "type": schema[key]["type"],
                            "required": schema[key]["required"]
                        };
                        /*fields[key]["type"] = schema[key]["type"];
                        fields[key]["required"] = schema[key]["required"];*/
                    }
                }
                //console.log(fields);
                resolve(fields)
            }
        })
    });
}

function BuildArrayOfImages(arr) {
    let out_map = new Map();
    for (let item of arr) {
        out_map.set(item.originalname, item.buffer);
    }
    return out_map;
}

function BuildQueue(map, folder) {
    let queue = [];
    let pathes = [];
    map.forEach((value, key, map) => {
        //console.log(key);
        let elem = folder + "/" + key;
        pathes.push(elem);
        let item = new Promise((resolve, reject) => {
            fs.writeFile(folder + "/" + key, value, (err) => {
                if (err) reject(err);
                else {
                    resolve(elem);
                    console.log("uploaded " + key);
                }
            });
        });
        queue.push(item);
    });
    //console.log(pathes + " is pathes");
    // let's update pathes array 
    let new_pathes = [];
    for (let i = 0; i < pathes.length; i++) {
        new_pathes[i] = pathes[i].substr(8); // from "./public/images"
    }
    return {
        "queue": Promise.all(queue),
        "pathes": new_pathes
    };
}

function CreateImageFolder() {
    let folder = config.upload + "/" + Math.floor((Math.random() * 1000000) + 1);
    return new Promise((resolve, reject) => {
        fs.mkdir(folder, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("folder has been created");
                resolve(folder);
            }
        });
    });
}

function CreateItem(obj, category) {
    connection.ConnectionBase();
    return new Promise((resolve, reject) => {
        categories.findOne({
            name: category
        }, (err, doc) => {
            if (err) reject(err);
            else {
                let schema = JSON.parse(doc.category);
                let id;
                let ready_obj = {};
                mongoose.connection.model(category).find((err, res) => {
                    if (err) reject(err);
                    else {
                        id = res.length + 1;
                        console.log(Object.keys(schema).length + " is schema length");
                        for (let key in schema) {
                            ready_obj[key] = "";
                        }
                        console.log(JSON.stringify(ready_obj) + " is ready_obj empty");
                        for (let key in ready_obj) {
                            if (key === "id") {
                                ready_obj[key] = id;
                            } else if (key === "comment" || key === "new" || key === "hot") {
                                ready_obj[key] = "";
                            } else {
                                ready_obj[key] = obj[key];
                            }
                            //ready_obj[key] = obj[key];
                        }
                        console.log(JSON.stringify(ready_obj) + " is ready_obj ready");
                        mongoose.connection.model(category).create([ready_obj], (err, res) => {
                            if (err) reject(err);
                            else {
                                console.log(res);
                                resolve("item was added successfully");
                            }
                        });
                    }
                });
            }
        });
    });
}

exports.getItems = getItems;
exports.getSchema = getSchema;
exports.BuildArrayOfImages = BuildArrayOfImages;
exports.CreateImageFolder = CreateImageFolder;
exports.BuildQueue = BuildQueue;
exports.CreateItem = CreateItem;