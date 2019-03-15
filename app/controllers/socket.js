'use strict';
module.exports = (app) => {
    app.socket.getAllUsers = (s) => {
        app.services.getAllUsers()
            .then(response =>{
                s.broadcast.emit('all-users', response);
            })
            // .catch(error => {});
    };

    app.socket.loginUser = (req, res) => {
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
