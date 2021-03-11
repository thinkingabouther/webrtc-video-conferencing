const authService = require("../services/authService")

exports.auth = async (req, res) => {
    const {token} = req.body;
    if (!token) {
        res.status(400);
        res.json();
        return;
    }
    const user = await authService.auth(token);
    if (user instanceof Error) {
        res.status(500);
        res.json();
    } else {
        req.session.userId = user._id;
        res.status(201);
        res.json(user);
    }
}