import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {SharedService} from "../../services/shared/shared.service";

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  user: any = {};
  @Output() passUser = new EventEmitter();


  constructor(
    private sharedService: SharedService
  ) { }

  ngOnInit() {
    if(this.sharedService.getUsers().length > 0) {
      this. users = this.sharedService.getUsers();
    }
  }

  selectUser(user){
    this.user = user;
    this.passUser.emit(this.user);
  }

}
