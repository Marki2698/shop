const mongoose = require("mongoose");
const connection = require("../mongoose/connection/connection");
const model_getter = require("../mongoose/model/category");
mongoose.Promise = Promise;

function getHotItems(categories) {
    connection.ConnectionBase();
    //let collections = mongoose.connection.db.collectionNames
    let all = [];
    for (let category of categories) {
        let model = model_getter.getCategoryModel(category);
        all.push(new Promise((resolve, reject) => {
            model.then((fulfilled) => {
                if (typeof fulfilled === "string") {
                    resolve(fulfilled + ", something went wrong");
                } else {
                    mongoose.connection.model(category).find((err, docs) => {
                        if(err) reject(err);
                        else resolve(docs);
                    })
                }
            }, (reason) => {
                reject(reason);
            });
        }));
    }

    return all;
}

exports.getHotItems = getHotItems;