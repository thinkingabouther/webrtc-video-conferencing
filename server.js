const express = require("express");
const http = require("http");
const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const path = require("path");
const rooms = {};

const socketToRoom = {};

io.on('connection', socket => {
    console.log(`socket with id ${socket.id} connected!`)
    socket.on("join room", roomID => {
        if (rooms[roomID]) {
            const length = rooms[roomID].length;
            if (length === 4) {
                socket.emit("room full");
                return;
            }
            rooms[roomID].push({
                socketID: socket.id,
                username: socket.id
            });
        } else {
            rooms[roomID] = [{
                socketID: socket.id,
                username: socket.id
            }];
        }
        socketToRoom[socket.id] = roomID;
        const usersInThisRoom = rooms[roomID].filter(user => user.socketID !== socket.id);

        socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", payload => {
        const user = rooms[payload.roomID].find(user => user.socketID === payload.callerID)
        io.to(payload.userToSignal).emit('user joined', {
            signal: payload.signal,
            callerID: payload.callerID,
            username: user.username
        });
    });

    socket.on("returning signal", payload => {
        io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
    });

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = rooms[roomID];
        if (room) {
            room = room.filter(id => id !== socket.id);
            rooms[roomID] = room;
        }
        socket.broadcast.emit("user left", socket.id)
    });

});


if (process.env.PROD) {
    app.use(express.static(path.join(__dirname, './client/build')))
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, './client/build/index.html'))
    })
    console.log("production!")
}
const port = parseInt(process.env.PORT) || 8000;
server.listen(port, () => console.log(`Server is running on port ${port}`))

