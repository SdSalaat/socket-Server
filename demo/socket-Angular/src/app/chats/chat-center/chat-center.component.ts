import {Component, Input, OnInit} from '@angular/core';
import {ChatsRouterService} from "../chats-router.service";
import {Socket} from "ngx-socket-io";

@Component({
  selector: 'app-chat-center',
  templateUrl: './chat-center.component.html',
  styleUrls: ['./chat-center.component.scss']
})
export class ChatCenterComponent implements OnInit {
  user: any = {};
  message: string = "";
  chats: any[] = [];
  activeUser = JSON.parse(localStorage.getItem('activeUser'));
  constructor(
    private chatService: ChatsRouterService,
    private socket: Socket
  ) { }

  ngOnInit() {
    this.socket.on('rec-message', (data) => {
      this.activeUser = JSON.parse(localStorage.getItem('activeUser'));
      if(data.chats.length > 0) {
        this.chats = [];
        this.chats = data.chats;
      }
    });
  }

  @Input('selectedUser')
  set selectedUser(data: any) {
    console.log(data);
    if(Object.keys(data).length > 0){
      this.user = data;
      this.activeUser = JSON.parse(localStorage.getItem('activeUser'));
      let payload = {
        senderID: this.activeUser._id,
        receiverID: this.user._id
      };
      this.chatService.userChats(payload)
        .subscribe(data => {
          if(data.userChats.length > 0){
            this.chats = data.userChats;
          }
        })
    }
  }

  sendMessage() {
    this.activeUser = JSON.parse(localStorage.getItem('activeUser'));
    let payload = {
      senderID: this.activeUser._id,
      receiverID: this.user._id,
      message: this.message
    };
    this.socket.emit('sending-message', payload);
  }

}
