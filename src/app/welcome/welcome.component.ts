import { Component } from '@angular/core';
import { GlobalVariablesService } from 'src/app/Service/global-variables.service';
import { Subscription } from 'rxjs';
@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent {


  hide: boolean=false;
  subscriptionNight: Subscription;
  previousNightState:boolean=false;
  constructor(public global:GlobalVariablesService){
  this.subscriptionNight = this.global.currentNight.subscribe(data => {
    if(data){
      document.documentElement.style.setProperty('--font-color-1','#fff' );

    }
    else{
      document.documentElement.style.setProperty('--font-color-1','#000' );

    }
  });
}
}
