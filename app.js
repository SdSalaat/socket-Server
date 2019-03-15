// Imports
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const router = express.Router();

// Server listening
// const server = app.listen( 3000, function () {
//     console.log("app Listening on port"+ process.env.PORT);
// });


// Socket Import
// const io = require('socket.io')();


// body-parser config
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));

// Cookie Parser
app.use(cookieParser());


// CORS headers
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");//false
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use('/api', router);

/*The Whole Application Files*/
require('./config')(mongoose, app);
require('./app/models')(app, mongoose);
require('./app/services')(app);
require('./app/controllers')(app);
require('./app/routes')(app, router);

/*The Whole Application Files*/


/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

/// error handlers

// development error handler
// will print stacktrace

if (app.get('env') === 'development') {
    app.use(function (err, req, res) {
        res.status(err.status || 500);
        res.send({
            message: err.message,
            error: err,
            title: 'error'
        });
    });
}

// production error handler
// no stacktraces leaked to user.js
app.use(function (err, req, res) {
    res.status(err.status || 500);
    res.send({
        message: err.message,
        error: {},
        title: 'error'
    });
});


module.exports = app;

// Schema Models
// const Schema = mongoose.Schema;

// let UserSchema = new Schema({
//     _id: Number,
//     name: String,
//     isActive: Boolean
// });
// let Users = mongoose.model('users', UserSchema);
//
// let ChatSchema = new Schema({
//     _id: { type: Schema.ObjectId, auto: true },
//     receiverID: String,
//     senderID: String,
//     message: String
// }, {timestamps: true});
// let Chats = mongoose.model('chats', ChatSchema);
//
//
// // express Router Calling
// /////////////////////////
// app.get('/', (req, res) => {
//     getAllUsers()
//         .then(data => {
//             res.json(data);
//         })
// });
// /// done
//
// app.post('/getChats', (req, res) => {
//     let payload = req.body;
//     getAllChats(payload)
//         .then( chat => {
//             res.json(chat)
//         })
// });
//
//
// // Socket Programming
// io.on('connection', (socket) => {
//
//     // On Every Connection pushing Socket ID
//     socketIDs.push(socket.id);
//
//     //Sent Message Received
//     socket.on('sending-message', (payload) => {
//         console.log(payload);
//         insertChatMessage(payload)
//             .then( chat => {
//                 console.log(chat);
//                 getAllChats(chat._doc)
//                 .then(chats => {
//                     io.emit('rec-message', chats);
//                 });
//
//             });
//     });
//
//     // User Login
//     socket.on('validate-user', (data) => {
//         getSingleUser(data)
//             .then(user => {
//                 if(user === null){
//                     throw new Error("User Doesn't exist")
//                 }
//                 let validUser = user._doc;
//                 validUser.socketID = socket.id;
//                 validUser.isActive = true;
//                 activePool.push(validUser);
//                 console.log(validUser);
//                 getAllUsers()
//                     .then(data => {
//                         socket.emit('validated-user.js', validUser);
//                         socket.broadcast.emit('all-users', data);
//                     });
//
//             })
//             .catch(err => { console.log(err)});
//     });
//
//     // Socket Disconnect
//     socket.on('disconnect', () => {
//         let index = activePool.map(o => { return o.socketID}).indexOf(socket.id);
//         if(index !== -1){
//             getSingleUser(activePool[index])
//                 .then(data => {
//                     console.log(data);
//                     activePool.splice(index, 1);
//                     getAllUsers()
//                         .then(data => {
//                             socket.broadcast.emit('all-users', data);
//                         });
//                 })
//         }
//     })
// });
//
// // Used DB Functions
// getAllUsers = () => {
//     return new Promise((resolve, reject) => {
//         Users.find({}, (err, users) => {
//             resolve(users);
//             reject(err)
//         })
//     })
// };
//
// getSingleUser = (data) => {
//     return new Promise((resolve, reject) => {
//         Users.findOneAndUpdate({name: data.name},{isActive: !data.isActive}, (err, user) => {
//             resolve(user);
//             reject(err)
//         })
//     })
// };
//
// insertChatMessage = (data) => {
//     return new Promise((resolve, reject) => {
//         Chats.create(data, (err, chat) => {
//             resolve(chat);
//             reject(err)
//         })
//     })
// };
//
//
// getAllChats = (data) => {
//     return new Promise((resolve, reject) => {
//         Chats.find({ $and: [{senderID: {$in: [data.senderID, data.receiverID]}, receiverID: {$in: [data.senderID, data.receiverID]} }] }, (err, chats) => {
//             let chatMessages = chats.map(chat => {
//                 return chat._doc;
//             });
//             resolve(chatMessages);
//             reject(err)
//         })
//     })
// };
