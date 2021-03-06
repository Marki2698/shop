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
                console.log(fulfilled + " is from asfasfasdf");
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

function CreateItem(obj, category, Imgfolder) {
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
                            } else if (key === "comment") {
                                ready_obj[key] = obj[key];
                            } else if (key === "new" || key === "hot") {
                                if (obj[key] === "true") ready_obj[key] = true;
                                else ready_obj[key] = false;
                            }
                            /*else if (key === "hot") {
                                                           if (obj[key] === "true") ready_obj[key] = true;
                                                           else ready_obj[key] = false;
                                                       }*/
                            else {
                                ready_obj[key] = obj[key];
                            }
                            //ready_obj[key] = obj[key];
                            //let t = new Boolean()
                        }
                        console.log(JSON.stringify(ready_obj) + " is ready_obj ready");
                        mongoose.connection.model(category).create([ready_obj], (err, res) => {
                            if (err) reject(err);
                            else {
                                console.log(res);
                                BindToID(id, category, Imgfolder);
                                resolve("item was added successfully");
                            }
                        });
                    }
                });
            }
        });
    });
}

function getAdminItem(category, id) {
    return new Promise((resolve, reject) => {
        mongoose.connection.model(category).findOne({
            id: id
        }, (err, doc) => {
            if (err) reject(err);
            else {
                let send_obj = {};
                console.log(Object.getOwnPropertyNames(doc));
                for (let key in doc) {

                    if (key !== "_id" || key !== "id" || key !== "__v") {
                        //continue;
                        send_obj[key] = doc[key];
                    }
                }
                console.log(send_obj);
                resolve(send_obj);
            }
        });
    });
}

function RemoveImagesFromItemFolder(id, category, img_folder, arr) { //???
    //let path = `${config.upload}/${category}${img_folder}`;
    let binds = JSON.parse(fs.readFileSync(`${config.upload}/${category}/binds.marki`, "utf-8"));
    let folder = binds[id];
    let path = `${config.upload}/${category}/${folder}`;
    console.log(binds[id] + " is folder");
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
                UnbindToID(id, category, img_folder);
            }
        }
    });
}

function updateItem(id, update, category, img_folder, new_images) {
    if (new_images === []) {
        console.log("empty array");
        return new Promise((resolve, reject) => {
            mongoose.connection.model(category).findOneAndUpdate({
                id: id
            }, update, (err, res) => {
                if (err) reject(err);
                else {
                    if (update["images"] !== []) {
                        RemoveImagesFromItemFolder(category, img_folder, update["images"]);
                    }
                    console.log(res);
                    resolve("updated");
                }
            });
        });
    } else {
        let map = BuildArrayOfImages(new_images);
        let folder = JSON.parse(fs.readFileSync(`${config.upload}/${category}/binds.marki`, "utf-8"));
        let status = BuildQueue(map, `${config.upload}/${category}/` + folder[id] + ``);
        return new Promise((resolve, reject) => {
            status.queue.then((fulfill) => {
                console.log(fulfill + " is fulfill");
                let update_item = JSON.parse(update);
                //console.log(JSON.stringify(update_item) + " is update");
                //console.log(Array.isArray(status.pathes) + " is fulfilled pathes");
                if (!update_item["images"]) {
                    update_item.images = status.pathes;
                    RemoveImagesFromItemFolder(id, category, img_folder, update_item["images"]);
                } else {
                    let temp = update_item["images"];
                    //console.log(temp + " is temp");
                    update_item["images"] = temp.concat(status.pathes);
                    RemoveImagesFromItemFolder(id, category, img_folder, update_item["images"]);

                    //console.log(update_item["images"] + " is final array");
                }
                console.log(JSON.stringify(update_item) + " is update");
                mongoose.connection.model(category).findOneAndUpdate({
                    id: id
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
    }
}

function removeAdminItems(category, ids) {
    let queue = [];
    for (let i = 0; i < ids.length; i++) {
        let item = new Promise((resolve, reject) => {
            mongoose.connection.model(category).findOneAndRemove({
                id: ids[i]
            }, (err, doc) => {
                if (err) reject(err);
                else {
                    RemoveImagesFromItemFolder(ids[i], category)
                    resolve("removed successfully");
                }
            });
        });
        queue.push(item);
    }
    return Promise.all(queue);
}

/*function updateItem(id, update, category, Imgfolder, new_images) {
    
}*/

exports.getItems = getItems;
exports.getSchema = getSchema;
exports.getAdminItem = getAdminItem;
exports.BuildArrayOfImages = BuildArrayOfImages;
exports.CreateImageFolder = CreateImageFolder;
exports.BuildQueue = BuildQueue;
exports.CreateItem = CreateItem;
exports.updateItem = updateItem;
exports.removeAdminItems = removeAdminItems;