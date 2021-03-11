const userRepository = require("../dbal/userRepository")
const { OAuth2Client } = require('google-auth-library')
const config = require("../config.js")
const client = new OAuth2Client(config.oauth.clientId)
const oauthConfig = config.oauth

exports.auth = async (token) => {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: oauthConfig.clientId
    });
    const {name, email} = ticket.getPayload();
    return await userRepository.save({name, email})
}
