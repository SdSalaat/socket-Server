module.exports = (app, router) => {
    router.route('/get/chats')
        .post(app.controllers.getChats);
};
