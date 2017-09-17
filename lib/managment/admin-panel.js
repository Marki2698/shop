const express = require("express");
const connection = require("../mongoose/connection/connection");
let categories = require("../mongoose/model/categories");

/*function getCategories() {
    connection.ConnectionBase();
    return new Promise((resolve, reject) => {
        categories.find((err, docs) => {
            if (err) reject(err);
            else {
                if (docs.length === 0) resolve(false);
                else resolve(docs);
            }
        });
    });
}*/

//exports.getCategories = getCategories;