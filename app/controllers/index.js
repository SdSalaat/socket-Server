'use strict';

module.exports = (app) => {
    require('./user')(app);
    require('./socket')(app);
};
