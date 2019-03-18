'use strict';

module.exports = (app, router) => {
    // app.use('/api', router);
    require('./user')(app, router);
    require('./chats')(app, router);


};
