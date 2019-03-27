'use strict';

module.exports = (app, wp, fs) => {
    require('./user')(app, wp, fs);
    require('./socket')(app, wp, fs);
    require('./chats')(app, wp, fs);
};
