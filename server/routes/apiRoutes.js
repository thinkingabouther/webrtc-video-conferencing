module.exports = (app) => {

    const authController = require('../controllers/authController');

    app.route('/api/auth')
        .post(authController.auth)

};
