(() => {
    'use strict';
    module.exports = (db, app) => {
        app.controllers = {};
        app.socket = {};
        app.db = {};
        app.services = {};
        app.constants = {};

        app.socketIDs = [];
        app.activePool = [];
        require('./db')(db,app);
    }
})();
