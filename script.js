const socket = io('http://localhost:8080');
let message = document.querySelector('#message');
let username = document.querySelector('#username');
let loginForm = document.querySelector('.loginForm');
let selectedUser = document.querySelector('#selectedUser');
let messageCenter = document.querySelector('.messageCenter');
let userSelected = {};
messageCenter.style.display = 'none';
selectedUser.style.display = 'none';



sendMessage = () => {
    message = document.querySelector('#message').value;
    let activeUser = JSON.parse(localStorage.getItem('activeUser'));
    let payload ={
        senderID: activeUser._id,
        receiverID: userSelected._id,
        message: message
    };
    socket.emit('sending-message', payload);
    document.querySelector('#message').value = '';
};

loginUser = () => {
    if (username.value === ''){
        alert('Enter username')
    } else {
        socket.emit('validate-user', {'name': username.value});
        let xHttp = new XMLHttpRequest();
        xHttp.onreadystatechange = () => {
            if (xHttp.readyState === 4 && xHttp.status === 200) {
                const users = JSON.parse(xHttp.responseText);
                let list = document.getElementById("userList");
                for(let i=0; i< users.length; i++) {
                    let listItem = document.createElement('li');
                    let button = document.createElement('button');
                    button.style.marginLeft = '10px';
                    button.innerText = "Send Message";
                    button.addEventListener('click', function () {
                        selectUser(users[i]);
                    });
                    listItem.appendChild(document.createTextNode(users[i].name));
                    listItem.appendChild(button);
                    list.appendChild(listItem);
                }
            }
        };
        xHttp.open("GET", "http://localhost:8080/", true);
        xHttp.setRequestHeader('Content-Type', 'Application/json');
        xHttp.send();
    }
};

socket.on('rec-message', (data) => {
    console.log(data)
});

socket.on('validated-user', (data) => {
    if(data.socketID){
        localStorage.setItem('activeUser', JSON.stringify(data));
        messageCenter.style.display = '';
        loginForm.style.display = 'none';
    }
});

selectUser = (user) =>{
    userSelected = user;
    selectedUser.style.display = '';
    document.getElementById("userList").style.display = 'none';
    console.log(user)
    selectedUser.innerHTML = `<b>Selected User : </b>` + user.name;
    let button = document.createElement('button');
    button.style.marginLeft = '10px';
    button.innerText = "Go Back";
    button.addEventListener('click', function () {
        goBack();
    });
    selectedUser.appendChild(button);
};

goBack = () => {
    userSelected = {};
    document.getElementById("userList").style.display = '';
    selectedUser.style.display = 'none';
}
