module.exports = (app) => {
    const Users = app.db.Users;

    app.services.getAllUsers = (payload) => {
        return new Promise((resolve, reject) => {
            Users.find(payload)
                .then(data => resolve({
                    data,
                    message: 'Users Fetched successfully!'
                }))

                .catch(error => reject({
                    message: 'Error while fetching user...',
                    error: error.errors
                }));
        });
    };

    app.services.loginUser = (payload) => {
        if (!payload.isActive) {
            payload.isActive = false;
        }

        let data = {email: payload.email, password: payload.password};
        let change = {isActive: !payload.isActive};
        return new Promise((resolve, reject) => {
            Users.findOneAndUpdate(data, change, {new: true})
                .then(data => {
                        if(data._doc.isActive){
                            app.activePool.push({
                                username: data.username,
                                socketID: app.socketIDs[app.socketIDs.length - 1],
                                isActive: data.isActive
                            });
                        }
                        resolve({
                            data,
                            message: 'User Logged In successfully!'
                        });
                    }
                )

                .catch(error => reject({
                    message: 'Error while Logging in user...',
                    error: error.errors
                }));
        })
            ;
    };
};
