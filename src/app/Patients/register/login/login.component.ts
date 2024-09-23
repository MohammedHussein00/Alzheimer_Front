import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { SignUp } from '../registerRespose';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/Service/loader.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  login:FormGroup;
  Message:string=''
  constructor(private http:HttpClient, private router: Router,public loader:LoaderService){
    this.login=new FormGroup({
      email:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',[Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&]).{8,}$')]),

    })
  }
  ngOnInit(): void {
  }



  loginNewAccount() {
    if (this.login.valid) {
      const phoneNumber = this.login.get('phone')?.value.toString();
      // Update the phone number in the form control
      this.login.get('phone')?.patchValue(phoneNumber);

      this.Login(this.login).subscribe({
        next: (response: any) => {
          if(response.message===''||response.message===null)
            {
          localStorage.clear();
          localStorage.setItem('token', response.token);
          localStorage.setItem('imUrl', response.imUrl);
          localStorage.setItem('name', response.name);
          localStorage.setItem('email', response.email);
          localStorage.setItem('emailConfirmed', response.emailConfirmed);
          localStorage.setItem('ExpiredOn', response.expiredOn !== undefined && response.expiredOn !== null ? response.expiredOn.toString() : '');
          localStorage.setItem('IsAuthenticated', response.isAuthenticated !== undefined && response.isAuthenticated !== null ? response.isAuthenticated.toString() : '');
          localStorage.setItem('Role', response.roles !== undefined && response.roles !== null ? response.roles.toString() : '');
          if(response.roles[0]==="Pateint")
          this.router.navigate(['/doctors']);
        else if(response.roles[0]==="Doctor")
          this.router.navigate(['/doctor/schedule']);
        else if(response.roles[0]==="Admin")
          this.router.navigate(['/dash/doctors']);
            }
            else
            this.Message=response.message
        },
        error: (errorResponse: HttpErrorResponse) => {
          // Handle error response
          if (errorResponse.error && typeof errorResponse.error === 'string') {
            this.Message = errorResponse.error; // Display error message
            console.log(this.Message);
          } else {
            console.error('Unexpected error:', errorResponse);
          }
        }
      });
    }
  }
  Login(x:FormGroup):Observable<any>
  {

   return this.http.post<any>('https://localhost:7213/api/auth/login',x.value);
  }




  lengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        // If the value is empty, return null (no error)
        return null;
      }
      // Check if the length of the value is equal to the specified length
      return value.toString().length !== length ? { 'lengthError': { value: value } } : null;
    };

  }


  showPassword = false;
  showConfirmPassword = false;

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }
  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }
}
