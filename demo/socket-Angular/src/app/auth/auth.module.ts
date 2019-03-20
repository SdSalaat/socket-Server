import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {AuthRoutingModule} from "./auth-routing.module";
import {RegisterComponent} from "./register/register.component";
import {FormsModule} from "@angular/forms";
import {SharedModule} from "../services/shared.module";
import {AuthRouterService} from "./auth-router.service";

@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    SharedModule,
    AuthRouterService,
    AuthRoutingModule
  ]
})
export class AuthModule { }
