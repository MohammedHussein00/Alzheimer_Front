import { Component, HostListener, OnInit } from '@angular/core';
import { GlobalVariablesService } from 'src/app/Service/global-variables.service';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/Service/auth.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-doctor-header',
  templateUrl: './doctor-header.component.html',
  styleUrls: ['./doctor-header.component.css']
})
export class DoctorHeaderComponent implements OnInit {
  isFullScreen = false;
  data: any;
  night: any;
  token:string|null=''
  name:string|null=''
  email:string|null=''
  roles:string[]|null=[]
  expiredOn!:Date|null
  isAuthenticated:boolean|null=true
  subscription!: Subscription;
  chats:Message[]=[]
  unReadNumber:number=0
  photo:string=''
  constructor(public global:GlobalVariablesService,private authService: AuthService, private router: Router,private http:HttpClient){

  }


  ngOnInit(): void {
    var p=localStorage.getItem('imgURL')
    if(p)
    this.photo=p
var email=localStorage.getItem('email')
if(email)
    this.getChat(email).subscribe(response=>{
      this.chats=response;

      this.chats.forEach(chat=>{
        if(chat.status==false)
        this.unReadNumber++;
      })
    })

    this.token = this.authService.getToken();
    this.name = this.authService.getName();
    this.email = this.authService.getEmail();
    this.roles = this.authService.getRoles();
    this.expiredOn = this.authService.getExpiredOn();
    this.isAuthenticated = this.authService.isAuthenticated();

    // You can now use this data in your component
  }


  toggleFullScreen() {
    if (!this.isFullScreen) {
      const elem = document.documentElement;
      if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.requestFullscreen) {
        elem.requestFullscreen();
      } else if (elem.requestFullscreen) {
        elem.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    this.isFullScreen = !this.isFullScreen;
  }

  @HostListener('document:fullscreenchange', ['$event'])
  onFullScreenChange(event: Event) {
    this.isFullScreen = !!document.fullscreenElement;
  }
  convert_to_moon_light(){
    this.global.night=!this.global.night;
    if(this.global.night){
    document.documentElement.style.setProperty('--icon-color','#8391a2' );

    document.documentElement.style.setProperty('--box-Sh','0px 0px 15px 0px rgb(255 255 255 / 0%)' );
    document.documentElement.style.setProperty('--main-class-color','#343a40' );
    document.documentElement.style.setProperty('--background-base','#3a444e' );
    document.documentElement.style.setProperty('--input-search-parent','#464f5b' );
    document.documentElement.style.setProperty('--filter-color','#2c343a' );
    document.documentElement.style.setProperty('--filter-header-color','#8391a2' );

    }
    else{
      document.documentElement.style.setProperty('--main-class-color','#e9eaeb' );
      document.documentElement.style.setProperty('--filter-color','#0198A0' );

      document.documentElement.style.setProperty('--filter-header-color','white' );
      document.documentElement.style.setProperty('--icon-color','#6c757d' );
      document.documentElement.style.setProperty('--box-Sh','0px 0px 15px 0px rgb(0 0 0 / 45%)' );
      document.documentElement.style.setProperty('--background-base','#fff' );
      document.documentElement.style.setProperty('--input-search-parent','#f0f3f8' );

    }

    this.subscription = this.global.currentNight.subscribe(data => {
      this.night=data
    });
  if (this.night)
    {
    this.global.convertNight(false);
    }
  else
  {
    this.global.convertNight(true);
  }


  }

  hide(){
    this.subscription = this.global.currentData.subscribe(data => {
      this.data = data;
    });
  if (this.data)
    {
    this.global.changeData(false);
    }
  else
  {
    this.global.changeData(true);
  }
  }


  logout(){
    localStorage.clear()
    this.router.navigate(['/Home']);

  }
  getChat(email: string): Observable<Message[]> {
    return this.http.get<Message[]>(`https://localhost:7213/api/Doctor/get-chat?email=${encodeURIComponent(email)}`);
  }
}
export interface Message {
  id: number;
  content: string;
  time: string; // Consider converting to Date type if needed
  status: boolean;
  patient: Panient; // Reference to Patient interface
}

export interface Panient {
  id: string;
  name: string;
  imgUrl: string;
}
