const mongoose = require("mongoose");
const connection = require("../mongoose/connection/connection");

function Start(session, email) {
    session.email = email;
}

function Destroy(session) {
    /*connection.ConnectionBase();
    console.log(mongoose.connection.collections);
    return mongoose.connection.db.dropCollection("session");*/
    /*.drop((err) => {
        if (err) console.error(err);
        else console.log("session destroyed");
    });*/
    session = null;
    //session.destroy();
}

function EnableSession(session) {
    return !!session.email;
}

exports.Start = Start;
exports.Destroy = Destroy;
exports.EnableSession = EnableSession;