/** @namespace socket.broadcast */
/** @namespace io.on */

// Imports
const http = require('http');
const app = http.createServer((req, res) => {
    if(req.url === '/'){
        res.writeHead(200, {'Content-Type':'Application/json','Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': '*',   }); // http header
        getAllUsers()
            .then(data => {
                res.statusCode = 200;
                res.write(JSON.stringify(data)); //write a response
                res.end();
            })

    }
});

const io = require('socket.io')(app);
const mongoose = require('mongoose');

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
});
let Chats = mongoose.model('chats', ChatSchema);

// Server listening
app.listen(8080);

// Establishing db Connection
mongoose.connect('mongodb://localhost:27017/mongochat', {useNewUrlParser: true}, () => {
    console.log('DataBase Connected');
});

// Socket Programming
io.on('connection', (socket) => {

    // On Every Connection pushing Socket ID
    socketIDs.push(socket.id);

    socket.on('sending-message', (payload) => {
        console.log(payload);
        Chats.insert(payload, (err, data) => {
            console.log(data);
        })
        socket.broadcast.emit('rec-message', data);
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
                socket.emit('validated-user', validUser);
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
