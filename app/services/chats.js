module.exports = (app) => {
    const Chats = app.db.Chats;

    app.services.getChats = (data) => {
        return new Promise((resolve, reject) => {
            Chats.find({
                $and: [{
                    senderID: {$in: [data.senderID, data.receiverID]},
                    receiverID: {$in: [data.senderID, data.receiverID]}
                }]
            })
                .then(chats => {
                    let userChats = chats.map(chat => {
                        return chat._doc;
                    });
                    resolve({
                        userChats,
                        message: 'Successfully get user chats...'
                    })
                })
                .catch(error => reject({
                    message: 'Error while getting user chats...',
                    error: error.errors
                }));
        });
    };

    app.services.insertChatMessage = (payload) => {
        return new Promise((resolve, reject) => {
            Chats.create(payload)
                .then(chats => {
                    resolve({
                        chats,
                        message: 'Successfully inserted user chats...'
                    })
                })
                .catch(error => reject({
                    message: 'Error while inserting user chats...',
                    error: error.errors
                }));
        })
    };


    app.services.getAllChats = (data) => {
        return new Promise((resolve, reject) => {
            Chats.find({ $and: [{senderID: {$in: [data.senderID, data.receiverID]}, receiverID: {$in: [data.senderID, data.receiverID]} }] })
                .then(chats => {
                    resolve({
                        chats,
                        message: 'Successfully fetched user chats...'
                    })
                })
                .catch(error => reject({
                    message: 'Error while fetching user chats...',
                    error: error.errors
                }));
        })
    };
};
