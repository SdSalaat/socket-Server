'use strict';

module.exports = (app, db) => {
    require('./User')(app, db);
};
