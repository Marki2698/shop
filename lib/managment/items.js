const connection = require("../mongoose/connection/connection");
const mongoose = require("mongoose");
const Item = require("../mongoose/model/item");
const models = require("../mongoose/model/category");
const categories = require("../mongoose/model/categories");
const config = require("../config/my_config");
const fs = require("fs");

function getItems(name) {
    return new Promise((resolve, reject) => {
        Item.find({
            category: name
        }, (err, docs) => {
            if(err) reject(err);
            else {
                console.log(Item.schema.obj);
                if(docs.length === 0) resolve(`${name} is empty.`);
                else resolve(docs);
            }
        });
    });
}

function getSchema() {
    console.log(Item.schema.obj);
    let obj = Object.assign({}, Item.schema.obj);
    delete obj.id;
    delete obj.comments;
    return new Promise((resolve, reject) => {
       resolve(JSON.stringify(obj)); 
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
        console.log(elem + " is elem");
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
        new_pathes[i] = pathes[i].substr(8); // from "/images"
    }
    console.log(new_pathes + " is new pathes");
    return {
        "queue": Promise.all(queue),
        "pathes": new_pathes
    };
}

function CreateImageFolder(category) {
    let num = Math.floor((Math.random() * 1000000) + 1);
    let folder = config.upload + "/" + category + "/" + num;
    return new Promise((resolve, reject) => {
        fs.mkdir(folder, (err) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("folder has been created");
                resolve([folder, num]);
            }
        });
    });
}

function BindToID(id, category, img_folder) {
    console.log(id, img_folder);
    let filename = `${config.upload}/${category}/binds.marki`;
    let obj = {};
    obj[id] = img_folder;
    console.log(JSON.stringify(obj) + " is obj");
    fs.writeFile(filename, JSON.stringify(obj), {
        encoding: "utf-8",
        mode: 0o666,
        flag: "wx"
    }, (err) => {
        if (err && err.code == "EEXIST") {
            fs.readFile(filename, (err, data) => {
                if (err) {
                    console.error(err);
                } else {
                    //console.log(data.toString("utf-8") + " is data");
                    let obj = data.toJSON();
                    //console.log(data + " is bindes");
                    let parsed = JSON.parse(data);
                    //console.log(JSON.stringify(parsed) + " is parsed");
                    parsed[id] = img_folder;
                    //console.log(JSON.stringify(parsed) + " is parsed");
                    fs.writeFile(filename, JSON.stringify(parsed), {
                        encoding: "utf-8",
                        mode: 0o666,
                        flag: "w"
                    }, (err) => {
                        if (err) console.error(err);
                        else console.log("binded");
                    });
                }
            });
        } else console.log("binded");
    });
}

function UnbindToID(id, category, img_folder) { // img_folder isn't neccessary I think
    let filename = `${config.upload}/${category}/binds.marki`;
    let binds = JSON.parse(fs.readFileSync(filename, "utf-8"));
    delete binds[`${id}`];
    fs.writeFile(filename, JSON.stringify(binds), {
        encoding: "utf-8",
        mode: 0o666,
        flag: "w"
    }, (err) => {
        if (err) console.error(err);
        else console.log("unbinded");
    });
}

function CreateItem(obj, name, Imgfolder) {
    return new Promise((resolve, reject) => {
        let id;
        let ready_obj = {};
        let schema = Item.schema.obj;
        Item.find({
            category: name
        }, (err, docs) => {
            if(err) reject(err);
            else {
                if(docs.length === 0) id = docs.length + 1;
                else id = docs[docs.length - 1].id + 1;
                console.log(id + " is _id");
                for (let key in schema) {
                    if (key === "id") {
                        ready_obj[key] = id;
                    } else if (key === "comments") {
                        ready_obj[key] = [];
                    } else if (key === "new" || key === "hot") {
                        if (obj[key] === "true") ready_obj[key] = true;
                        else ready_obj[key] = false;
                    } else if(key === "price" || key === "quantity" || key === "sale"){
                        ready_obj[key] = parseFloat(obj[key]);
                    } else {
                        ready_obj[key] = obj[key];
                    }
                }
                console.log(Object.keys(ready_obj));
                Item.create([ready_obj], (err, doc) => {
                    if(err) reject(err);
                    else {
                        BindToID(doc[0]._id, name, Imgfolder);
                        resolve("item was added successfully");
                    }
                });
            }
        });
    });
}

function getAdminItem(category, id) {
    return new Promise((resolve, reject) => {
        Item.findOne({
            category,
            id
        }, (err, doc) => {
            if(err) reject(err);
            else {
                let send_obj = {};
                for (let key in doc) {

                    if (key !== "_id" || key !== "id" || key !== "__v") {
                        //continue;
                        send_obj[key] = doc[key];
                    }
                }
                resolve(send_obj);
            }
        })
    })
}

function RemoveImagesFromItemFolder(_id, category, img_folder, arr) { //???
    //let path = `${config.upload}/${category}${img_folder}`;
    let binds = JSON.parse(fs.readFileSync(`${config.upload}/${category}/binds.marki`, "utf-8"));
    let folder = binds[_id];
    let path = `${config.upload}/${category}/${folder}`;
    console.log(binds[_id] + " is folder");
    fs.readdir(path, (err, files) => {
        if (err) console.error(err);
        else {
            console.log(files);
            console.log(arr);
            let imgs;
            if (arr) {
                imgs = arr.map((value, index, array) => {
                    return value.substr(path.length - 7);
                });
                for (let item of files) {
                    if (imgs.indexOf(item) === -1) {
                        fs.unlink(`${path}/${item}`, (err) => {
                            if (err) console.error(err);
                            else console.log("unlinked");
                        });
                    }
                }
            } else {
                for (let item of files) {
                    fs.unlink(`${path}/${item}`, (err) => {
                        console.log(`${path}/${item}`);
                        if (err) console.error(err);
                        else console.log("unlinked");
                    });
                }
                fs.rmdir(`${path}`, (err) => {
                    if (err) console.error(err);
                    console.log("folder removed");
                });
                UnbindToID(_id, category, img_folder);
            }
        }
    });
}

function updateItem(id, update, category, img_folder, new_images) {
    if(new_images === undefined) {
        console.log("empty array");
        return new Promise((resolve, reject) => {
            Item.findOneAndUpdate({
                id: id,
                category: category
            }, (err, res) => {
                if(err) reject(err);
                else {
                    if (update["images"] !== undefined) {
                        console.log(update["images"]);
                        RemoveImagesFromItemFolder(res._id, category, img_folder, update["images"]);
                    }
                    console.log(res);
                    resolve("updated");
                }
            });
        });
    } else {
        return new Promise((resolve, reject) => {
            Item.findOne({
                id: id,
                category: category
            }, (err, res) => {
                let map = BuildArrayOfImages(new_images);

                let folder = JSON.parse(fs.readFileSync(`${config.upload}/${category}/binds.marki`, "utf-8"));
                console.log(`${config.upload}/${category}/` + folder[res._id] + ``);
                let status = BuildQueue(map, `${config.upload}/${category}/` + folder[res._id] + ``);
                status.queue.then((fulfill) => {
                    console.log(fulfill + " is fulfill");
                    let update_item = JSON.parse(update);
                    //console.log(JSON.stringify(update_item) + " is update");
                    //console.log(Array.isArray(status.pathes) + " is fulfilled pathes");
                    if (!update_item["images"]) {
                        update_item.images = status.pathes;
                        RemoveImagesFromItemFolder(res._id, category, img_folder, update_item["images"]);
                    } else {
                        let temp = update_item["images"];
                        //console.log(temp + " is temp");
                        update_item["images"] = temp.concat(status.pathes);
                        RemoveImagesFromItemFolder(res._id, category, img_folder, update_item["images"]);
    
                        //console.log(update_item["images"] + " is final array");
                    }
                    console.log(JSON.stringify(update_item) + " is update");
                    Item.findOneAndUpdate({
                        id: id,
                        category: category
                    }, update_item, (err, res) => {
                        if (err) reject(err);
                        else {
                            console.log(res);
                            resolve("updated");
                        }
                    });
                }, (reason) => {
                    console.error(reason);
                });
            });
        });
    }
}

function removeAdminItems(category, ids) {
    let queue = [];
    for(let i = 0; i < ids.length; i++) {
        let item = new Promise((resolve, reject) => {
            Item.findOneAndRemove({
                id: ids[i],
                category: category
            }, (err, doc) => {
                if(err) reject(err);
                else {
                    RemoveImagesFromItemFolder(doc._id, category);
                    resolve("removed successfully");
                }
            })
        })
    }
}


exports.getItems = getItems;
exports.getSchema = getSchema;
exports.getAdminItem = getAdminItem;
exports.BuildArrayOfImages = BuildArrayOfImages;
exports.CreateImageFolder = CreateImageFolder;
exports.BuildQueue = BuildQueue;
exports.CreateItem = CreateItem;
exports.updateItem = updateItem;
exports.removeAdminItems = removeAdminItems;