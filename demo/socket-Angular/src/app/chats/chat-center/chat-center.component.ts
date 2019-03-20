import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-center',
  templateUrl: './chat-center.component.html',
  styleUrls: ['./chat-center.component.scss']
})
export class ChatCenterComponent implements OnInit {
  user:any = {};
  constructor() { }

  ngOnInit() {

  }
  @Input('selectedUser')
  set selectedUser(data: any) {
    console.log(data);
    this.user = data;
    const activeUser = JSON.parse(localStorage.getItem('activeUser'));
    let payload = {
      senderID: activeUser._id,
      receiverID: this.user._id
    };
  }

}
