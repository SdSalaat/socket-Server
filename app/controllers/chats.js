'use strict';
module.exports = (app) => {

    app.controllers.getChats = (req, res) => {
        let payload = req.body;
        app.services.getChats(payload)
            .then(response => res.json(response))
            .catch(error => res
                .status(error.status || 500)
                .json(error)
            );
    };

    app.controllers.insertChatMessage = (req, res) => {
      let payload = req.body;
        app.services.getChats(payload)
            .then(response => res.json(response))
            .catch(error => res
                .status(error.status || 500)
                .json(error)
            );
    };
};
