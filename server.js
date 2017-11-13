const express = require("express");
const session = require("express-session");
const parser = require("body-parser");
const MongoStore = require("connect-mongo")(session);
const mongoose = require("mongoose");
const config = require("./lib/config/my_config");
const helmet = require("helmet");
const connection = require("./lib/mongoose/connection/connection");
let app = express();

app.use(helmet());
app.use(session({
    resave: false,
    secret: config.secret,
    saveUninitialized: false
}));

app.use(express.static("public"));
app.use(parser.urlencoded({
    extended: false
}));

app.set("view engine", "pug");

app.use((req, res, next) => {
    res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
    next();
});

connection.ConnectionBase();
//connection.ConnectionCatalog();
app.use(require("./lib/routes/admin"));
app.use(require("./lib/routes/admin-panel"));
app.use(require("./lib/routes/categories"));
app.use(require("./lib/routes/items"));
app.use(require("./lib/routes/public"));

app.listen(config.port, () => {
    console.log(`Listening on ${config.port} port`);
});