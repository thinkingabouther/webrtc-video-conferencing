const dbConnection = require("./dbConnection.js");
const arangojs = require("arangojs");
const collectionName = "users";
const collection = dbConnection.collection(collectionName);
const aql = arangojs.aql;

module.exports = {
  async save(user) {
    user = await collection.save(user);
    return user;
  },

  async findById(id) {
    return await collection.firstExample({ _id: id });
  },

  async findByEmail(email) {
    const cursor = await dbConnection.query(aql`
    FOR user IN ${collection}
    FILTER user.email == ${email}
    LIMIT 1
    RETURN user`);
    const result = await cursor.all();
    return result.length === 0 ? null : result[0];
  },
};
