const mongoose = require("mongoose");
const config = require("../../config/my_config");


//re-factoring
function ConnectionBase() {
    /*return mongoose.createConnection(config.mongoose.base, {
        useMongoClient: true
    });*/
    mongoose.connect(config.mongoose.base, {
        useMongoClient: true
    });
}

function ConnectionCatalog() {
    /*return mongoose.createConnection(config.mongoose.catalog, {
        useMongoClient: true
    });*/
    mongoose.connect(config.mongoose.catalog, {
        useMongoClient: true
    });
}

function CloseConnection() {
    mongoose.disconnect((err) => {
        console.error(err);
    });
}

exports.ConnectionBase = ConnectionBase;
exports.ConnectionCatalog = ConnectionCatalog;
exports.CloseConnection = CloseConnection;