module.exports = (app) => {

    const authController = require('../controllers/authController');

    app.route('/api/auth/login')
        .post(authController.login)
    app.route('/api/auth/logout')
        .delete(authController.logout)
    app.route('/api/auth/me')
        .get(authController.me)

};
