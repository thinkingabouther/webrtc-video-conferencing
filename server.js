const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app)
const socket = require("socket.io")
const io = socket(server)
const path = require("path")

const rooms = {}

io.on("connection", socket => {
    console.log(`socket with id ${socket.id} connected!`)
    socket.on("join room", roomID => {
        if (rooms[roomID]) rooms[roomID].push(socket.id);
        else rooms[roomID] = [socket.id];

        const peer = rooms[roomID].find(id => id !== socket.id);
        if (peer) {
            socket.emit("peer", peer);
            socket.to(peer).emit("peer joined");
        }
    });
    socket.on("offer", payload => {
        io.to(payload.target).emit("offer", payload)
    })
    socket.on("answer", payload => {
        io.to(payload.target).emit("answer", payload)
    })
    socket.on("ice-candidate", incoming => {
        io.to(incoming.target).emit("ice-candidate", incoming.candidate);
    })

})

if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, './client/build')))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'))
    })
}
const port = parseInt(process.env.PORT) || 8000;
server.listen(port, () => console.log(`Server is running on port ${port}`))