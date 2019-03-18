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
                app.services.getAllChats(chat.chats._doc)
                    .then(chats => {
                        io.emit('rec-message', chats);
                    });

            });
    });

// Socket Disconnect
    socket.on('disconnect', () => {
        let index = app.activePool.map(o => {
            return o.socketID
        }).indexOf(socket.id);
        if (index !== -1) {
            app.services.loginUser(app.activePool[index])
                .then(() => {
                    app.activePool.splice(index, 1);
                    app.services.getAllUsers()
                        .then(data => {
                            socket.broadcast.emit('all-users', data);
                        });
                })
        }
    })

})
;
