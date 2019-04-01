/** @namespace socket.broadcast */
/** @namespace io.on*/
/** @namespace io.emit */
/** @namespace app.get */
/** @namespace app.services */
/** @namespace app.controllers */
/** @namespace app.socketIDs */
/** @namespace app.activePool */

const debug = require('debug')('expressapp');
const app = require('../app');
const fs = require('fs');
const wp = require('web-push');

app.set('port', process.env.PORT || 3000);

const server = app.listen(app.get('port'), () => {
    console.log(server.address()
        .port);
    debug('Express server listening on port ' + server.address()
        .port);
});


const io = require('socket.io')(server);


// Socket Programming
io.on('connection', (socket) => {

    // On Every Connection pushing Socket ID
    app.socketIDs.push(socket.id);

// User Login
    socket.on('validate-user', () => {
        app.services.getAllUsers()
            .then(data => {
                socket.emit('validated-user', data.data);
                io.emit('all-users', data.data);
            })
            .catch(err => {
                console.log(err)
            });
    });

    //Sent Message Received
    socket.on('sending-message', (payload) => {
        app.services.insertChatMessage(payload)
            .then(chat => {
                fs.readFile('subscriptions.json', (err, jsonData) => {
                    if(err){
                        console.log(err)
                    } else {
                        let data = JSON.parse(jsonData);
                        data.subscriptions = data.subscriptions.filter(function(returnableObjects){
                            if(returnableObjects.email === payload.receiverEmail){
                                let paylaodForPush = {
                                    "notification": {
                                        "title": "New Message",
                                        "body": `${payload.senderID} has sent you a message`,
                                        "vibrate": [100, 50, 100],
                                        "data": {
                                            "dateOfArrival": Date.now(),
                                            "senderID": payload.senderID,
                                            "url": socket.handshake.headers.origin
                                        },
                                        "actions": [{
                                            "action": "explore",
                                            "title": "Go to the site"
                                        }]
                                    }
                                }
                                wp.sendNotification(returnableObjects.sub, JSON.stringify(paylaodForPush));
                            }
                        });
                    }
                });
                app.services.getAllChats(chat.chats._doc)
                    .then(chats => {
                        io.emit('rec-message', chats);
                    });

            });
    });

// Socket Disconnect
    socket.on('logout-user', (user) => {
        fs.readFile('subscriptions.json', (err, jsonData) => {
            if(err){
                console.log(err)
            } else {
                let data = JSON.parse(jsonData);
                data.subscriptions = data.subscriptions.filter(function(returnableObjects){
                    return returnableObjects.email !== user.email;
                });
                fs.writeFile('subscriptions.json', JSON.stringify(data), () => {})
            }
        });
            app.services.disconnectUser(user)
                .then(() => {
                    app.services.getAllUsers()
                        .then(data => {
                            socket.broadcast.emit('all-users', data.data);
                            socket.emit('logged-out', true)
                        });
                })
    })

})
;
