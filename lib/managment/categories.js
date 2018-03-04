const express = require("express");
const connection = require("../mongoose/connection/connection");
const categories = require("../mongoose/model/categories");
const mongoose = require("mongoose");
const models = require("../mongoose/model/category");
const fs = require("fs");
const config = require("../config/my_config");

function createCategory(name) {
    return new Promise((resolve, reject) => {
        categories.find((err, docs) => {
            if(err) reject(err);
            else {
                if(docs.length === 0) {
                    categories.create([{
                        categories: [name]
                    }], (err, res) => {
                        if(err) reject(err);
                        else {
                            resolve(`category : ${name} has been created.`);
                            fs.mkdir(`${config.upload}/${name}`, (err) => {
                                if(err) reject(err);
                                else console.log("folder has been created.");
                            });
                        }
                    });
                } else {
                    let list = docs[0].categories;
                    let updated = list;
                    console.log(list);
                    if(list.indexOf(name) === -1) {
                        updated.push(name);
                        //let update = list.push(name);
                        console.log(updated);
                        categories.findByIdAndUpdate(docs[0]._id, {
                            categories: updated
                        }, (err, doc) => {
                            if(err) reject(err);
                            else {
                                fs.mkdir(`${config.upload}/${name}`, (err) => {
                                    if(err) reject(err);
                                    else resolve(`category : ${name} has been created.`);
                                });
                            }
                        })
                    } else {
                        resolve(`category : ${name} already exists.`);
                    }
                    
                }
            }
        })
    });
}

function getCategories() {
    return new Promise((resolve, reject) => {
        categories.find((err, doc) => {
            if(err) reject(err);
            else {
                if(doc.length === 0) resolve(false);
                else resolve(doc[0].categories);
            }
        });
    });
}

function removeCategoryFolder(path) {
    if (fs.existsSync(path)) {
        fs.readdirSync(path).forEach(function(file, index) {
            var curPath = path + "/" + file;
            if (fs.lstatSync(curPath).isDirectory()) { // recurse
                removeCategoryFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

function removeCategory(name) {
    return new Promise((resolve, reject) => {
        categories.find((err, docs) => {
            if(err) reject(err);
            else {
                let list = docs[0].categories;
                let updated = docs[0].categories;
                let index = list.indexOf(name);
                updated.splice(index, 1);
                categories.findByIdAndUpdate(docs[0]._id, {
                    categories: updated
                }, (err, doc) => {
                    if(err) reject(err);
                    else {
                        removeCategoryFolder(`${config.upload}/${name}`);
                        resolve(`${name} : category has been removed.`);
                    }
                });
            }
        });
    });
}

exports.createCategory = createCategory;
exports.getCategories = getCategories;
exports.removeCategory = removeCategory;