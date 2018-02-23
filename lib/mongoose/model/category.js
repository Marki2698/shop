const mongoose = require("mongoose");
const gen = require("mongoose-gen");
const categories = require("../model/categories");
const connection = require("../connection/connection");

function getCategoryModel(name) {
    // refactoring
    return new Promise((resolve, reject) => {
        categories.findOne({
            name: name
        }, (err, doc) => {
            if (err) reject(err);
            else {
                if (doc === null) {
                    resolve("there are no category");
                } else {
                    let parsed = JSON.parse(doc.category);
                    let _schema = new mongoose.Schema(gen.convert(parsed));
                    try {
                        mongoose.model(name);
                    } catch (error) {
                        resolve(mongoose.model(name, _schema, name));
                    }
                    resolve(true);
                    // check if model exists and returns MODEL!!!
                }
            }
        });
    });
}

exports.getCategoryModel = getCategoryModel;