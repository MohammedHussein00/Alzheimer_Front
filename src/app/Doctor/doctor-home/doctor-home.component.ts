import { Component, HostListener } from '@angular/core';
import {GlobalVariablesService} from 'src/app/Service/global-variables.service'
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-doctor-home',
  templateUrl: './doctor-home.component.html',
  styleUrls: ['./doctor-home.component.css'],

})
export class DoctorHomeComponent {

  hide: boolean=false;
  subscriptionNight: Subscription;
  constructor(public global:GlobalVariablesService){
    this.subscriptionNight = this.global.currentData.subscribe(data => {
    this.hide=data;
  });
}



}



