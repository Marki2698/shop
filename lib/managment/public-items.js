const mongoose = require("mongoose");
const connection = require("../mongoose/connection/connection");
const model_getter = require("../mongoose/model/category");
const public_items_util = require("../utils/public-items-util");
mongoose.Promise = Promise;

function getHotItems(categories) {
    connection.ConnectionBase();
    //let collections = mongoose.connection.db.collectionNames
    let documents = [];
    for (let category of categories) {
        let model = model_getter.getCategoryModel(category);
        documents.push(new Promise((resolve, reject) => {
            model.then((fulfilled) => {
                if (typeof fulfilled === "string") {
                    resolve(fulfilled + ", something went wrong");
                } else {
                    mongoose.connection.model(category).find({
                        "hot": true
                    })
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

exports.getHotItems = getHotItems;