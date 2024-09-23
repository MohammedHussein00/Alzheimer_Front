import { Component } from '@angular/core';
import { GlobalVariablesService } from 'src/app/Service/global-variables.service';
import { Subscription } from 'rxjs';
import { AuthService } from '../Service/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  hide: boolean=false;
  isAuthenticated: boolean=false;
  subscriptionNight: Subscription;
  previousNightState:boolean=false;
  constructor(public global:GlobalVariablesService,private authService: AuthService,private router:Router){
    this.isAuthenticated = this.authService.isAuthenticated();


    this.subscriptionNight = this.global.currentData.subscribe(data => {
      this.hide=data;
    });


    this.subscriptionNight = this.global.currentNight.subscribe(data => {
      if(data){
        document.documentElement.style.setProperty('--sider-color','#3a444e' );
        document.documentElement.style.setProperty('--sider-shadow','0px 0px 5px 0px rgb(0 0 0 / 50%)' );
        document.documentElement.style.setProperty('--hr','white' );
      }
      else{
        document.documentElement.style.setProperty('--sider-color','#0198A0' );
        document.documentElement.style.setProperty('--sider-shadow','0px 0px 11px 0px rgb(34 37 40 / 25%)' );
        document.documentElement.style.setProperty('--hr','black' );
      }
    });

  }
  isActiveRoute(routes: string[]): boolean {
    return routes.some(route => this.router.isActive(route, false));
  }
  navigateToDetection(): void {
    this.router.navigate(['/d/detection']);
  }

  navigateToHistory(): void {
    this.router.navigate(['/d/history']);
  }
}
