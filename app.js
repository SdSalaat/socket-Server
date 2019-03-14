/** @namespace socket.broadcast */
/** @namespace io.on*/
/** @namespace io.emit */
/** @namespace app.get */
/** @namespace app.post */

// Imports
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

// Server listening
const server = app.listen( 3000, function () {
    console.log("app Listening on port"+ process.env.PORT);
});

const io = require('socket.io')(server);

app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb'
}));


app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, POST, DELETE");
    res.header("Access-Control-Allow-Credentials", "true");//false
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// Local Variables
let activePool = [];
let socketIDs = [];
const Schema = mongoose.Schema;

let UserSchema = new Schema({
    _id: Number,
    name: String,
    isActive: Boolean
});
let Users = mongoose.model('users', UserSchema);

let ChatSchema = new Schema({
    _id: { type: Schema.ObjectId, auto: true },
    receiverID: String,
    senderID: String,
    message: String
}, {timestamps: true});
let Chats = mongoose.model('chats', ChatSchema);



// Establishing db Connection
mongoose.connect('mongodb://localhost:27017/mongochat', {useNewUrlParser: true}, (err, db) => {
    if(err){
        throw err
    }
    // Chats = db.collection('chats');
    // Users = db.collection('users');
    console.log('DataBase Connected');
});

// express Router Calling
app.get('/', (req, res) => {
    getAllUsers()
        .then(data => {
            res.json(data);
        })
});

app.post('/getChats', (req, res) => {
    let payload = req.body;
    getAllChats(payload)
        .then( chat => {
            res.json(chat)
        })
});
// express Router Calling

// Socket Programming
io.on('connection', (socket) => {

    // On Every Connection pushing Socket ID
    socketIDs.push(socket.id);

    socket.on('sending-message', (payload) => {
        console.log(payload);
        insertChatMessage(payload)
            .then( chat => {
                console.log(chat);
                getAllChats(chat._doc)
                .then(chats => {
                    io.emit('rec-message', chats);
                });

            });

    });

    socket.on('validate-user', (data) => {
        getSingleUser(data)
            .then(user => {
                if(user === null){
                    throw new Error("User Doesn't exist")
                }
                let validUser = user._doc;
                validUser.socketID = socket.id;
                validUser.isActive = true;
                activePool.push(validUser);
                console.log(validUser);
                getAllUsers()
                    .then(data => {
                        socket.emit('validated-user', validUser);
                        socket.broadcast.emit('all-users', data);
                    });

            })
            .catch(err => { console.log(err)});
    });

    socket.on('disconnect', () => {
        let index = activePool.map(o => { return o.socketID}).indexOf(socket.id);
        if(index !== -1){
            getSingleUser(activePool[index])
                .then(data => {
                    console.log(data);
                    activePool.splice(index, 1);
                    getAllUsers()
                        .then(data => {
                            socket.broadcast.emit('all-users', data);
                        });
                })
        }
    })

});


getAllUsers = () => {
    return new Promise((resolve, reject) => {
        Users.find({}, (err, users) => {
            resolve(users);
            reject(err)
        })
    })
};

getSingleUser = (data) => {
    return new Promise((resolve, reject) => {
        Users.findOneAndUpdate({name: data.name},{isActive: !data.isActive}, (err, user) => {
            resolve(user);
            reject(err)
        })
    })
};

insertChatMessage = (data) => {
    return new Promise((resolve, reject) => {
        Chats.create(data, (err, chat) => {
            resolve(chat);
            reject(err)
        })
    })
};


getAllChats = (data) => {
    return new Promise((resolve, reject) => {
        Chats.find({ $and: [{senderID: {$in: [data.senderID, data.receiverID]}, receiverID: {$in: [data.senderID, data.receiverID]} }] }, (err, chats) => {
            let chatMessages = chats.map(chat => {
                return chat._doc;
            });
            resolve(chatMessages);
            reject(err)
        })
    })
};
