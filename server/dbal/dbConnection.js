const arangojs = require("arangojs");
const dbConfig = require("../config.js").db;
const dbConnection = arangojs({url: dbConfig.url, agentOptions: {ca: Buffer.from(dbConfig.encodedCA, "base64")}});

module.exports = dbConnection.useBasicAuth(dbConfig.user, dbConfig.password);

