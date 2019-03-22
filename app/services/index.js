'use strict';

module.exports = (app, db) => {
    require('./user')(app, db);
    require('./chats')(app, db);
};
