const userConnectionRepository = require("../dbal/userConnectionRepository");
const userRepository = require("../dbal/userRepository");
const uuid = require("uuid").v1

exports.addFriend = async (user, friendEmail) => {
    const id = uuid();
    const friend = await userRepository.findByEmail(friendEmail);
    if (!friend) throw new Error("user not found");
    const existingEdge = await userConnectionRepository.findConnection(user._id, friend._id);
    if (existingEdge) throw new Error("Edge already exists");
    await userConnectionRepository.addConnection(user._id, friend._id, id);
}