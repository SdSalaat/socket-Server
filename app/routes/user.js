module.exports = (app, router) => {
    router.route('/user/getUsers')
        .get(app.controllers.getAllUsers);
    router.route('/user/login')
        .post(app.controllers.loginUser);
    router.route('/user/register')
        .post(app.controllers.registerUser);
};
