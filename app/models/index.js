'use strict';

module.exports = (app, db) => {
    require('./User')(app, db);
    require('./Chats')(app, db);
};
