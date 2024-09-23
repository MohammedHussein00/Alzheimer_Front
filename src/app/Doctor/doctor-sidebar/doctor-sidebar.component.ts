import { Component } from '@angular/core';
import { GlobalVariablesService } from 'src/app/Service/global-variables.service';
import { Subscription, filter } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-doctor-sidebar',
  templateUrl: './doctor-sidebar.component.html',
  styleUrls: ['./doctor-sidebar.component.css']
})
export class DoctorSidebarComponent {
  hide: boolean=false;
  subscriptionNight: Subscription;
  previousNightState:boolean=false;
  isActive: boolean = false;

  constructor(public global:GlobalVariablesService,private router: Router){


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
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.updateActiveState();
    });
  }


  // Check if any of the given routes are active
  isActiveRoute(routes: string[]): boolean {
    return routes.some(route => this.router.isActive(route, false));
  }

  // Update active state based on current route
  updateActiveState(): void {
    // Example routes to check for active state
    const routesToCheck = ['/doctor/d/detection', '/doctor/d/history'];
    this.isActive = this.isActiveRoute(routesToCheck);
  }

  navigateToDetection(): void {
    this.router.navigate(['/doctor/d/detection']);
  }

  navigateToHistory(): void {
    this.router.navigate(['/doctor/d/history']);
  }
}
