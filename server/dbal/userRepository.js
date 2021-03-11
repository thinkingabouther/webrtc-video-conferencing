const dbConnection = require("./dbConnection.js");
const collectionName = "users";
const collection = dbConnection.collection(collectionName)

module.exports = {
    async save(user) {
        user = await collection.save(user);
        return user;
    },

    async findById(id) {
        return await collection.firstExample({_id: id});
    }
}
