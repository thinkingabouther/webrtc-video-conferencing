# webrtc-video-conferencing

## Overwiev

This app allows users to communicate with each over using WebRTC techonological stack.

The app is built with:

- Client with **React**, server with **NodeJS+Express**
- Connection protocols: **Simple Peer** as an overhead for WebRTC, **socket.io** to connect the server with the client
- **ArangoDB** (**PaaS ArangoDB Oasis**) to store user data and rooms data
- Authorization using **Google OAuth**

The app is deployed to **Heroku** using **Github Actions** and **Docker** and is available [here](https://webrtc-video-conferencing.herokuapp.com).

Database is available [here](https://f470bba3add9.arangodb.cloud:8529/_db/_system/_admin/aardvark/index.html), credentials may be reached [here](https://github.com/thinkingabouther/webrtc-video-conferencing/blob/master/server/config.js).

## How to use

### In development mode

#### Requirements:

1. Any IDE compatible with React web apps
2. `brew install npm`
3. `brew install yarn`

#### What to do:

1. Install dependencies with `yarn`:

```
cd server && yarn
```

```
cd client && yarn
```

2. Run server with:

```
cd server && npm start
```

3. Run client in development mode with:

```
cd client && yarn start
```

All request from client will be proxied (prxoy is set [here](https://github.com/thinkingabouther/webrtc-video-conferencing/blob/master/client/package.json)

### In test mode using `Docker`:

1. Build an image with:

```
docker build -t your-image-tag-name .
```

2. Run a container using:

```
docker run \
--env PORT=any-port-in-container \
-p your-desired-port:port-in-container \
your-image-name
```
