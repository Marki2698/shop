const mongoose = require("mongoose");
const connection = require("../mongoose/connection/connection");
const model_getter = require("../mongoose/model/category");
const public_items_util = require("../utils/public-items-util");
mongoose.Promise = Promise;

function getNewOrHotItems(categories, _hot, _new) {
    connection.ConnectionBase();
    let query;
    if(_hot === true) {
        query = {
            "hot": _hot
        }
    } else if(_new === true) {
        query = {
            "new": _new
        }
    }
    let documents = [];
    for (let category of categories) {
        let model = model_getter.getCategoryModel(category);
        documents.push(new Promise((resolve, reject) => {
            model.then((fulfilled) => {
                if (typeof fulfilled === "string") {
                    resolve(fulfilled + ", something went wrong");
                } else {
                    mongoose.connection.model(category).find(query)
                    .exec((err, docs) => {
                        if(err) reject(err);
                        else {
                            resolve(public_items_util.FormatDocs(docs, category));
                        }
                    });
                }
            }, (reason) => {
                reject(reason);
            });
        }));
    }

    return Promise.all(documents);
}

function getItem(category, id) {
    console.log(category, id);
    connection.ConnectionBase();
    let model = model_getter.getCategoryModel(category);
    return new Promise((resolve, reject) => {
        model.then((fulfilled) => {
            if(typeof fulfilled === "string") {
                resolve(fulfilled + ", something went wrong");
            } else {
                mongoose.connection.model(category).findOne({
                    "id": id
                }, (err, doc) => {
                    if(err) reject(err);
                    else resolve(doc);
                });
            }
        }, (reason) => {
            reject(reason);
        });
    });
}

exports.getNewOrHotItems = getNewOrHotItems;
exports.getItem = getItem;