const mongoose = require("mongoose");
const connection = require("../mongoose/connection/connection");
const model_getter = require("../mongoose/model/category");
const Item = require("../mongoose/model/item");
const public_items_util = require("../utils/public-items-util");
mongoose.Promise = Promise;

/* function getNewOrHotItems( _hot, _new) {
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
} */

function getNewOrHotItems(_hot, _new) {
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
    return new Promise((resolve, reject) => {
        Item.find(query, {
            "category": 1, 
            "id": 1,
            "name": 1, 
            "images": 1
        }, (err, res) => {
            if(err) reject(err);
            else {
                if(res.length === 0) resolve("there are no hot or new products");
                else resolve(public_items_util.FormatDocs(res));
            }
        })
    });
}

function getCategoryItems(name) {
    return new Promise((resolve, reject) => {
        Item.find({
            category: name
        }, {
            id: 1,
            name: 1, 
            price: 1,
            images: 1
        }, (err, res) => {
            if(err) reject(err);
            else resolve(res);
        });
    });
}

function getItem(category, id) {
    return new Promise((resolve, reject) => {
        Item.findOne({
            category: category,
            id: id
        }, (err, doc) => {
            if(err) reject(err);
            else resolve(doc);
        });
    });
}

exports.getNewOrHotItems = getNewOrHotItems;
exports.getItem = getItem;
exports.getCategoryItems = getCategoryItems;