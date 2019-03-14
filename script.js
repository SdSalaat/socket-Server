/** @namespace io */

const socket = io('http://localhost:3000');
let message = document.querySelector('#message');
let username = document.querySelector('#username');
let userList = document.querySelector('#userList');
let loginForm = document.querySelector('.loginForm');
let selectedUser = document.querySelector('#selectedUser');
let messageCenter = document.querySelector('.messageCenter');
let messages = document.querySelector('.messages');
let userSelected = {};
messageCenter.style.display = 'none';
selectedUser.style.display = 'none';
messages.style.display = 'none';
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
        socket.emit('validate-user', {'name': username.value});
        let xHttp = new XMLHttpRequest();
        xHttp.onreadystatechange = () => {
            if (xHttp.readyState === 4 && xHttp.status === 200) {
                const users = JSON.parse(xHttp.responseText);
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
                        if(users[i].isActive){
                            let span = document.createElement('span');
                            span.innerHTML = '&#8226;';
                            listItem.appendChild(document.createTextNode(users[i].name));
                            span.style.marginLeft = '10px';
                            span.style.color = 'green';
                            listItem.appendChild(span);
                        }
                        else{
                            listItem.appendChild(document.createTextNode(users[i].name));
                        }
                        listItem.appendChild(button);
                        list.appendChild(listItem);
                    }
                }
            }
        };
        xHttp.open("GET", "http://localhost:3000/", true);
        xHttp.setRequestHeader('Content-Type', 'Application/json');
        xHttp.send();
    }
};

socket.on('rec-message', (data) => {
    activeUser = JSON.parse(localStorage.getItem('activeUser'));

    if (data.length > 0) {

        if (parseInt(data[0].senderID, 10) === userSelected._id || parseInt(data[0].receiverID, 10) === userSelected._id) {
            messages.innerHTML = '';
            data.map(chat => {
                // if (parseInt(chat.senderID, 10) === activeUser._id && parseInt(chat.receiverID, 10) === userSelected._id) {
                let div = document.createElement('div');
                if (parseInt(chat.senderID, 10) === activeUser._id) {
                    div.innerHTML = `<b>${activeUser.name} : </b> ${chat.message}`;
                } else if (parseInt(chat.receiverID, 10) === activeUser._id) {
                    div.innerHTML = `<b>${userSelected.name} : </b> ${chat.message}`;
                }
                messages.appendChild(div);
                // }
            })
        }
    }
});

socket.on('validated-user', (data) => {
    if (data.socketID) {
        localStorage.setItem('activeUser', JSON.stringify(data));
        messageCenter.style.display = '';
        loginForm.style.display = 'none';
    }
});

socket.on('all-users', data => {
    let list = document.getElementById("userList");
    list.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        activeUser = JSON.parse(localStorage.getItem('activeUser'));
        if(activeUser !== undefined || activeUser !== null){
            if (activeUser._id !== data[i]._id) {
                let listItem = document.createElement('li');
                let button = document.createElement('button');
                button.style.marginLeft = '10px';
                button.innerText = "Send Message";
                button.addEventListener('click', function () {
                    selectUser(data[i]);
                });
                if(data[i].isActive){
                    let span = document.createElement('span');
                    span.innerHTML = '&#8226;';
                    listItem.appendChild(document.createTextNode(data[i].name));
                    span.style.marginLeft = '10px';
                    span.style.color = 'green';
                    listItem.appendChild(span);
                }
                else{
                    listItem.appendChild(document.createTextNode(data[i].name));
                }
                listItem.appendChild(button);
                list.appendChild(listItem);
            }
        }
    }
});

selectUser = (user) => {
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
            const chatMessages = JSON.parse(xHttp.responseText);
            messages.style.display = '';
            userList.style.display = 'none';

            selectedUser.style.display = '';
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

                if (parseInt(chatMessages[0].senderID, 10) === userSelected._id || parseInt(chatMessages[0].receiverID, 10) === userSelected._id) {
                    messages.innerHTML = '';
                    chatMessages.map(chat => {
                        // if (parseInt(chat.senderID, 10) === activeUser._id && parseInt(chat.receiverID, 10) === userSelected._id) {
                        let div = document.createElement('div');
                        if (parseInt(chat.senderID, 10) === activeUser._id) {
                            div.innerHTML = `<b>${activeUser.name} : </b> ${chat.message}`;
                        } else if (parseInt(chat.receiverID, 10) === activeUser._id) {
                            div.innerHTML = `<b>${userSelected.name} : </b> ${chat.message}`;
                        }
                        messages.appendChild(div);
                    });
                }
            }
        }
    };
    xHttp.open("POST", "http://localhost:3000/getChats", true);
    xHttp.setRequestHeader('Content-Type', 'Application/json');
    xHttp.send(JSON.stringify(payload));

    // HTTP Call
};

goBack = () => {
    userSelected = {};
    document.getElementById("userList").style.display = '';
    selectedUser.style.display = 'none';
    messages.style.display = 'none';
};
