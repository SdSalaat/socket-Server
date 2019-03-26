'use strict';

module.exports = (app) => {
    require('./user')(app);
    require('./chats')(app);
};
