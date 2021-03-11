const express = require("express");
const bodyparser = require("body-parser");
const sessionMiddleware = require("./middleware/sessionMiddleware");
const loginMiddleware = require("./middleware/loginMiddleware");
const path = require("path");
const routes = require('./routes/apiRoutes');

const app = express();

if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, '../client/build')))
    app.get("/", (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })
    app.get("/room/:roomID", (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build/index.html'))
    })
    console.log("production!")
}


app.use(bodyparser.json());
sessionMiddleware(app);
loginMiddleware(app);
routes(app);

module.exports = app;