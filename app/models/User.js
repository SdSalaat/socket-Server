'use strict';
module.exports = (app, db) => {

    const Schema = db.Schema;

    const userSchema = new Schema({
            name: {type: String, required: [true, 'Name is Required']},
            username: {type: String, required: true},
            email: {type: String, unique: true},
            picture: {type: String, default: ''},
            password: {type: String},
            phone: {type: String},
            isActive: {type: Boolean, default: false}
        },
        {
            timestamps: true
        });

    app.db.Users = db.model('users', userSchema);
};
