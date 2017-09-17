const express = require("express");
const connection = require("../mongoose/connection/connection");
let categories = require("../mongoose/model/categories");
const mongoose = require("mongoose");
const models = require("../mongoose/model/category");

function createCategory(name, category) {
    connection.ConnectionBase();
    return new Promise((resolve, reject) => {
        categories.findOne({
            name: name
        }, (err, res) => {
            if (err) reject(err);
            else {
                if (res === null) {
                    categories.create([{
                        name: name,
                        category: category
                    }], (err, res) => {
                        if (err) reject(err);
                        else resolve("category has been created");
                    });
                } else {
                    resolve("category already exists");
                }
            }
        });
    });
}

function getCategories() {
    connection.ConnectionBase();
    return new Promise((resolve, reject) => {
        //categories.remove()
        categories.find((err, docs) => {
            if (err) reject(err);
            else {
                if (docs.length === 0) resolve(false);
                else {
                    let names = [];
                    for (let i = 0; i < docs.length; i++) {
                        names[i] = docs[i].name;
                    }
                    resolve(names);
                }
            }
        });
    });
}

function removeFromDBAndCategories(category) {
    return new Promise((resolve, reject) => {
        mongoose.connection.collections[category].drop().then((fulfill) => {
            categories.findOneAndRemove({
                name: category
            }, (err, res) => {
                if (err) reject(err);
                else resolve("category has been totally removed from db");
            });
        }, (reason) => {
            reject(reason);
        });
    });
}

function removeFromCategories(category) {
    return new Promise((resolve, reject) => {
        categories.findOneAndRemove({
            name: category
        }, (err, res) => {
            if (err) reject(err);
            else resolve("category has been totally removed");
        });
    });
}

//mongoose.connection.collections["test1"].update()

function removeCategory(category) {
    connection.ConnectionBase();
    console.log(mongoose.connection.modelNames());
    let modelNames = mongoose.connection.modelNames();
    for (let name of modelNames) {
        if (name === category) {
            console.log(name + " is name");
            return removeFromDBAndCategories(category);
        } else {
            return removeFromCategories(category);
        }
    }
}

exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.removeCategory = removeCategory;