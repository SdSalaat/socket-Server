'use strict';

module.exports = (db, app) => {

    // const url = 'mongodb://admin:admin123@ds125402.mlab.com:25402/e-commerce-collab';
    const url = 'mongodb://localhost:27017/mongochat';
    db.Promise = global.Promise;
    db.connect(url, { useNewUrlParser: true })
        .then((res) => console.log('mongoDB connected!'))
        .catch(err => console.log(err));
};
