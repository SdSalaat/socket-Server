'use strict';
module.exports = (app, wp, fs) => {
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
            email: req.body.email,
            password: req.body.password
        };
        let subscription = req.body.sub;
        app.services.loginUser(payload)
            .then(response => {
                res.json(response);
                if (subscription !== undefined) {
                    fs.readFile('subscriptions.json', (err, jsonData) => {
                        if (err) {
                            console.log(err)
                        } else {
                            let data = JSON.parse(jsonData);
                            let index = -1;
                            for (let i = 0; i < data.subscriptions.length; i++) {
                                if (data.subscriptions[i].email === req.body.email) {
                                    index = i;
                                    break;
                                }
                            }
                            if (index !== -1) {
                                data.subscriptions[index].sub = subscription
                            } else {
                                data.subscriptions.push({
                                    sub: subscription,
                                    email: req.body.email,
                                });
                            }
                            fs.writeFile('subscriptions.json', JSON.stringify(data), () => {
                            })
                        }
                    });
                }
            })
            .catch(error => res
                .status(error.status || 500)
                .json(error)
            );
    };

    app.controllers.registerUser = (req, res) => {
        let payload = {
            email: req.body.email,
            name: req.body.name,
            username: req.body.username,
            phone: req.body.phone,
            password: req.body.password
        };
        app.services.registerUser(payload)
            .then(response => res.json(response))
            .catch(error => res
                .status(error.status || 500)
                .json(error)
            );
    };
};


