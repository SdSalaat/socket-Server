'use strict';

module.exports = (db, app) => {

    const url = 'mongodb://admin:admin811@ds121176.mlab.com:21176/server-socker-db';
    // const url = 'mongodb://localhost:27017/mongochat';
    db.Promise = global.Promise;
    db.connect(url, { useNewUrlParser: true })
        .then((res) => console.log('mongoDB connected!'))
        .catch(err => console.log(err));
};
