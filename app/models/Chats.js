'use strict';
module.exports = (app, db) => {

    const Schema = db.Schema;

    const chatsSchema = new Schema({
            _id: {type: Schema.ObjectId, auto: true},
            receiverID: String,
            senderID: String,
            message: String
        },
        {
            timestamps: true
        });

    app.db.Chats = db.model('chats', chatsSchema);
};
