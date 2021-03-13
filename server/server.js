const http = require("http");
const socketServer = require("./infrustructure/socketServer.js");
const app = require("./infrustructure/app.js");

const server = http.createServer(app);
socketServer(server);

const port = parseInt(process.env.PORT) || 8000;
server.listen(port, () => console.log(`Server is running on port ${port}`));
