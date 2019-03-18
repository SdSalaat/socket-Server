/** @namespace io */

const socket = io('http://localhost:3000');
let message = document.querySelector('#message');
let username = document.querySelector('#username');
let userList = document.querySelector('#userList');
let loginForm = document.querySelector('.loginForm');
let selectedUser = document.querySelector('#selectedUser');
let messageCenter = document.querySelector('.messageCenter');
let messages = document.querySelector('.messages');
let messageField = document.querySelector('#messageField');
let userSelected = {};
messageCenter.style.display = 'none';
messageField.style.display = 'none';
selectedUser.style.display = 'none';
messages.style.display = 'none';
messages.scrollTop = messages.scrollHeight;
let activeUser = JSON.parse(localStorage.getItem('activeUser'));


sendMessage = () => {
    message = document.querySelector('#message').value;
    activeUser = JSON.parse(localStorage.getItem('activeUser'));
    let payload = {
        senderID: activeUser._id,
        receiverID: userSelected._id,
        message: message
    };
    socket.emit('sending-message', payload);
    document.querySelector('#message').value = '';
};

loginUser = () => {
    if (username.value === '') {
        alert('Enter username')
    } else {
        let xHttp = new XMLHttpRequest();
        xHttp.onreadystatechange = () => {
            if (xHttp.readyState === 4 && xHttp.status === 200) {
                socket.emit('validate-user', {'name': username.value});
                const users = JSON.parse(xHttp.responseText).data;
                localStorage.setItem('activeUser', JSON.stringify(users));
            }
        };
        xHttp.open("POST", "http://localhost:3000/api/user/login", true);
        xHttp.setRequestHeader('Content-Type', 'application/json');
        xHttp.send(JSON.stringify({username: username.value}));
    }
};

socket.on('rec-message', (data) => {
    activeUser = JSON.parse(localStorage.getItem('activeUser'));

    if (data.chats.length > 0) {

        if (data.chats[0].senderID === userSelected._id || data.chats[0].receiverID === userSelected._id) {
            messages.innerHTML = '';
            data.chats.map(chat => {
                // if (parseInt(chat.senderID, 10) === activeUser._id && parseInt(chat.receiverID, 10) === userSelected._id) {
                let div = document.createElement('div');
                if (chat.senderID === activeUser._id) {
                    div.innerHTML = `<b>${activeUser.name} : </b> ${chat.message}`;
                } else if (chat.receiverID === activeUser._id) {
                    div.innerHTML = `<b>${userSelected.name} : </b> ${chat.message}`;
                }
                messages.appendChild(div);
                messages.scrollTop = messages.scrollHeight;
                // }
            })
        }
    }
});

socket.on('validated-user', (users) => {
    let list = document.getElementById("userList");
    for (let i = 0; i < users.length; i++) {
        activeUser = JSON.parse(localStorage.getItem('activeUser'));
        if (activeUser._id !== users[i]._id) {
            let listItem = document.createElement('li');
            let button = document.createElement('button');
            button.style.marginLeft = '10px';
            button.innerText = "Send Message";
            button.addEventListener('click', function () {
                selectUser(users[i]);
            });
            if (users[i].isActive) {
                let span = document.createElement('span');
                span.innerHTML = '&#8226;';
                listItem.appendChild(document.createTextNode(users[i].name));
                span.style.marginLeft = '10px';
                span.style.color = 'green';
                listItem.appendChild(span);
            } else {
                listItem.appendChild(document.createTextNode(users[i].name));
            }
            listItem.appendChild(button);
            list.appendChild(listItem);
        }
    }
    messageCenter.style.display = '';
    loginForm.style.display = 'none';

});

socket.on('all-users', data => {
    let list = document.getElementById("userList");
    list.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        activeUser = JSON.parse(localStorage.getItem('activeUser'));
        if (activeUser !== undefined || activeUser !== null) {
            // if (activeUser._id !== data[i]._id) {
            if (activeUser.username !== data[i].username) {
                let listItem = document.createElement('li');
                let button = document.createElement('button');
                button.style.marginLeft = '10px';
                button.innerText = "Send Message";
                button.addEventListener('click', function () {
                    selectUser(data[i]);
                });
                if (data[i].isActive) {
                    let span = document.createElement('span');
                    span.innerHTML = '&#8226;';
                    listItem.appendChild(document.createTextNode(data[i].name));
                    span.style.marginLeft = '10px';
                    span.style.color = 'green';
                    listItem.appendChild(span);
                } else {
                    listItem.appendChild(document.createTextNode(data[i].name));
                }
                listItem.appendChild(button);
                list.appendChild(listItem);
            }
        }
    }
});

selectUser = (user) => {
    messageField.style.display = '';
    userSelected = user;
    activeUser = JSON.parse(localStorage.getItem('activeUser'));
    let payload = {
        senderID: activeUser._id,
        receiverID: userSelected._id
    };
    // HTTP Call
    let xHttp = new XMLHttpRequest();
    xHttp.onreadystatechange = () => {
        if (xHttp.readyState === 4 && xHttp.status === 200) {
            const chatMessages = JSON.parse(xHttp.responseText).userChats;
            selectedUser.style.display = '';
            messages.style.display = '';
            userList.style.display = 'none';

            document.getElementById("userList").style.display = 'none';
            console.log(user);
            selectedUser.innerHTML = `<b>Selected User : </b>` + user.name;
            let button = document.createElement('button');
            button.style.marginLeft = '10px';
            button.innerText = "Go Back";
            button.addEventListener('click', function () {
                goBack();
            });
            selectedUser.appendChild(button);
            if (chatMessages.length > 0) {

                if (chatMessages[0].senderID === userSelected._id || chatMessages[0].receiverID === userSelected._id) {
                    messages.innerHTML = '';
                    chatMessages.map(chat => {
                        // if (parseInt(chat.senderID, 10) === activeUser._id && parseInt(chat.receiverID, 10) === userSelected._id) {
                        let div = document.createElement('div');
                        if (chat.senderID === activeUser._id) {
                            div.innerHTML = `<b>${activeUser.name} : </b> ${chat.message}`;
                        } else if (chat.receiverID === activeUser._id) {
                            div.innerHTML = `<b>${userSelected.name} : </b> ${chat.message}`;
                        }
                        messages.appendChild(div);
                        messages.scrollTop = messages.scrollHeight;
                    });
                }
            }
        }
    };
    xHttp.open("POST", "http://localhost:3000/api/get/chats", true);
    xHttp.setRequestHeader('Content-Type', 'Application/json');
    xHttp.send(JSON.stringify(payload));

    // HTTP Call
};

goBack = () => {
    userSelected = {};
    document.getElementById("userList").style.display = '';
    selectedUser.style.display = 'none';
    messages.innerHTML = '';
    messages.style.display = 'none';
    messageField.style.display = 'none';
};
