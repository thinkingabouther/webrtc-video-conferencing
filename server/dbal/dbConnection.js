const arangojs = require("arangojs");
const dbConfig = require("../config.js").db;
const dbConnection = arangojs({
  url: dbConfig.url,
  databaseName: "webrtc",
});

module.exports = dbConnection.useBasicAuth(dbConfig.user, dbConfig.password);