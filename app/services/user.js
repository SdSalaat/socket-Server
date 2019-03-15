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
        if(!payload.isActive){
            payload.isActive = false;
        }
        return new Promise((resolve, reject) => {
            Users.findOneAndUpdate({username: payload.username},{isActive: !payload.isActive})
                .then(data => resolve({
                    data,
                    message: 'User Logged In successfully!'
                }))

                .catch(error => reject({
                    message: 'Error while Logging in user...',
                    error: error.errors
                }));
        });
    };
};
