const userService = require("../services/userService");

exports.addFriend = async (req, res) => {
    if (!req.user) {
        res.status(403);
        res.json({
            message: "You have to login before adding a friend!"
        });
        return;
    }
    try {
        await userService.addFriend(req.user, req.body.email);
    }
    catch (e) {
        res.status(400);
        res.json({
            message: e.message
        })
        return
    }
    res.status(201);
    res.json({
        message: "Connection successfully created!"
    });
}