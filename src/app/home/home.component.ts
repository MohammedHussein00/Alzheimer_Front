import { Component, HostListener, OnInit } from '@angular/core';
import {GlobalVariablesService} from 'src/app/Service/global-variables.service'
import { Subscription } from 'rxjs';
import { AuthService } from '../Service/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],

})
export class HomeComponent implements OnInit {
  token:string=''
  name:string=''
  email:string=''
  roles:string=''
  expiredOn:string=''
  isAuthenticated:string=''
  hide: boolean=false;
  subscriptionNight: Subscription;
  constructor(public global:GlobalVariablesService,private authService: AuthService){
    this.subscriptionNight = this.global.currentData.subscribe(data => {
    this.hide=data;
  });


  }
  ngOnInit(): void {
    // Fetch user-related data
    const token = this.authService.getToken();
    const name = this.authService.getName();
    const email = this.authService.getEmail();
    const roles = this.authService.getRoles();
    const expiredOn = this.authService.getExpiredOn();
    const isAuthenticated = this.authService.isAuthenticated();

    // You can now use this data in your component
  }




}



