const socket = require("socket.io");

module.exports = (server) => {
  const rooms = {};
  const socketToRoom = {};
  const io = socket(server);
  io.on("connection", (socket) => {
    console.log(`socket with id ${socket.id} connected!`);
    socket.on("join room", (connectionInfo) => {
      if (rooms[connectionInfo.roomID]) {
        const length = rooms[connectionInfo.roomID].length;
        if (length === 4) {
          socket.emit("room full");
          return;
        }
        rooms[connectionInfo.roomID].push({
          socketID: socket.id,
          username: connectionInfo.username,
        });
      } else {
        rooms[connectionInfo.roomID] = [
          {
            socketID: socket.id,
            username: connectionInfo.username,
          },
        ];
      }
      socketToRoom[socket.id] = connectionInfo.roomID;
      const usersInThisRoom = rooms[connectionInfo.roomID].filter(
        (user) => user.socketID !== socket.id
      );
      socket.emit("all users", usersInThisRoom);
    });

    socket.on("sending signal", (payload) => {
      const user = rooms[payload.roomID].find(
        (user) => user.socketID === payload.callerID
      );
      const userInfo = {
        signal: payload.signal,
        callerID: payload.callerID,
        username: user.username,
      };
      io.to(payload.userToSignal).emit("user joined", userInfo);
    });

    socket.on("returning signal", (payload) => {
      io.to(payload.callerID).emit("receiving returned signal", {
        signal: payload.signal,
        id: socket.id,
      });
    });

    socket.on("disconnect", () => {
      const roomID = socketToRoom[socket.id];
      let room = rooms[roomID];
      if (room) {
        room = room.filter((peer) => peer.socketID !== socket.id);
        rooms[roomID] = room;
      }
      socket.broadcast.emit("user left", socket.id);
    });
  });
};
