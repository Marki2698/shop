const connection = require("../mongoose/connection/connection");
const admin = require("../mongoose/model/admin");
const crypto = require("crypto");
const config = require("../config/my_config");


function CryptPass(password) {
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(password, config.salt, 1024, 32, "sha1", (err, key) => {
            if (err) reject(err);
            else resolve(key.toString('hex'));
        });
    });
}



function EnableAdmin() {
    /*let conn = connection.ConnectionCatalog();
    console.log(conn);*/
    return new Promise((resolve, reject) => {
        /*let conn = connection.ConnectionBase();
        console.log(conn.db.databaseName);*/
        connection.ConnectionBase();
        admin.find((err, docs) => {
            if (err) reject(err)
            else {
                if (docs.length === 0) resolve(false);
                else resolve(true);
                /*conn.close().then((ful) => {
                    console.log(ful);
                }, (res) => {
                    console.error(res);
                });*/
            }
        });
    });
}

function CreateAdmin(email, password) {
    let crypt = CryptPass(password);
    return new Promise((resolve, reject) => {
        crypt.then((fulfilled) => {
            connection.ConnectionBase();
            //let conn = connection.ConnectionBase();
            admin.create([{
                email: email,
                password: fulfilled
            }], (err, doc) => {
                if (err) reject(err);
                else {
                    resolve(true);
                    /*conn.close().then((ful) => {
                        console.log(ful);
                    }, (res) => {
                        console.error(res);
                    });*/
                }
            });
        }, (reason) => {
            console.error(reason);
        });
    });
}

function FindAdmin(email, password) {
    let crypt = CryptPass(password);
    return new Promise((resolve, reject) => {
        crypt.then((fulfilled) => {
            //let conn = connection.ConnectionBase();
            connection.ConnectionBase();
            admin.findOne({
                email: email,
                password: fulfilled
            }, (err, res) => {
                if (err) reject(err);
                else {
                    if (res === null) {
                        resolve(false);
                        /*conn.close().then((ful) => {
                            console.log(ful);
                        }, (res) => {
                            console.error(res);
                        });*/
                    } else {
                        resolve(true);
                        /*conn.close().then((ful) => {
                            console.log(ful);
                        }, (res) => {
                            console.error(res);
                        });*/
                    }
                }
            });
        });
    });
}

exports.EnableAdmin = EnableAdmin;
exports.CreateAdmin = CreateAdmin;
exports.FindAdmin = FindAdmin;