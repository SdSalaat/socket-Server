'use strict';
module.exports = (app) => {
    app.controllers.getAllUsers = (req, res) => {
        app.services.getAllUsers()
            .then(response => res.json(response))
            .catch(error => res
                .status(error.status || 500)
                .json(error)
            );
    };

    app.controllers.loginUser = (req, res) => {
        let payload = {
            username: req.body.username
        };
        app.services.loginUser(payload)
            .then(response => res.json(response))
            .catch(error => res
                .status(error.status || 500)
                .json(error)
            );
    };
};
