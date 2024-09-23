import { HttpClient } from '@angular/common/http';
import { Component, HostListener } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from '../Service/loader.service';
export interface verify{
  userName:string;
  email:string;
}
@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.css']
})
export class VerificationComponent {
  constructor(private titleService: Title,private http:HttpClient, private router: Router,public loader:LoaderService) {}
code:string=''
  ngOnInit() {
    this.titleService.setTitle('Verify Email');
    const email = localStorage.getItem('email');
    const name = localStorage.getItem('name');

    if (email&&name) {

      this.sendVerification({userName:name,email:email}).subscribe(data => {
        this.code=data.data
      });
    }
  }

  verifyCode(digit1: string, digit2: string, digit3: string, digit4: string, digit5: string, digit6: string) {
    // Check if all digits are provided
    if (digit1 && digit2 && digit3 && digit4 && digit5 && digit6) {
      // Check if all inputs are digits
      if (/^\d{1}$/.test(digit1) && /^\d{1}$/.test(digit2) && /^\d{1}$/.test(digit3) &&
          /^\d{1}$/.test(digit4) && /^\d{1}$/.test(digit5) && /^\d{1}$/.test(digit6)) {
        const verificationCode = (digit1 + digit2 + digit3 + digit4 + digit5 + digit6).toString();
      console.log(this.code,verificationCode)
      if(this.code.toString()===verificationCode){
        var email=localStorage.getItem("email");
        if(email)
        this.verifyYourEmail(email).subscribe(response=>{
          if(response==="Your email verified successuflly")
            localStorage.setItem("EmailConfirmed",'true')
          if(localStorage.getItem("Role")==="Pateint")
            this.router.navigate(['/doctors']);
          else if(localStorage.getItem("Role")==="Doctor"){
            const name=localStorage.getItem('name')
          if(name)
            this.router.navigate([`/schedule-table:${name.replace(" ","-")}`]);
        }

        })
      }

      }
    }
  }

verifyYourEmail(email: string): Observable<string> {
    return this.http.get<string>(`https://localhost:7213/api/Auth/verify?email=${encodeURIComponent(email)}`);
  }
  sendVerification(model: verify): Observable<any> {
    return this.http.post<any>('https://localhost:7213/api/Auth/verify',model);
  }
  @HostListener('window:keyup', ['$event'])
  handleKeyUp(event: KeyboardEvent) {
    this.goToNextInput(event);
  }

  goToNextInput(event: KeyboardEvent): boolean {
    const key = event.which;
    const target = event.target as HTMLInputElement;
    const inputs = Array.from(document.querySelectorAll('input'));
    const index = inputs.indexOf(target);

    if (key !== 9 && (key < 48 || key > 57)) {
      event.preventDefault();
      return false;
    }

    if (key === 9) {
      return true;
    }

    const nextIndex = index === inputs.length - 1 ? 0 : index + 1;
    const nextInput = inputs[nextIndex];
    if (nextInput) {
      nextInput.select();
      nextInput.focus();
      return true;
    }

    return false; // This line ensures all paths return a value
}

  @HostListener('window:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    const key = event.which;

    if (key === 9 || (key >= 48 && key <= 57)) {
      return true;
    }

    event.preventDefault();
    return false;
  }

  @HostListener('window:click', ['$event'])
  handleClick(event: MouseEvent) {
    const target = event.target as HTMLElement;
    if (target instanceof HTMLInputElement) {
      target.select();
    }
  }
}
