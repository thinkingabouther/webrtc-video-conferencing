const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);

const path = require("path");

const WebRTCSocketService = require("./WebRTCSocketService.js").WebRTCSocketService
WebRTCSocketService(server);

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

app.get("/api", (req, res) => {
    res.json({
        hello: "hello",
        hello2: "hello2"
    })
})

const port = parseInt(process.env.PORT) || 8000;
server.listen(port, () => console.log(`Server is running on port ${port}`))

