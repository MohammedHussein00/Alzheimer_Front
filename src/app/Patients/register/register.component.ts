import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import  {Observable} from 'rxjs'
import { SignUp } from './registerRespose';
import { Router } from '@angular/router';
import { ReceivedData } from 'src/app/select-list/received-data';
import { Mode } from 'src/app/select-list/Mode';
import { LoaderService } from 'src/app/Service/loader.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit  {
  Message:string=''
  register:FormGroup;
  selectResult: number = 0;


  mode: Mode =
  {
    defaultBG: { light: '#f5f5f5', night: '#404954' },
    defaultBGHover: { light: '#ececec', night: '#47515d' },
    defaultBorderHover: { light: 'black', night: '#8391a2' },
    defaultBorder: { light: 'rgba(0, 0, 0, 0.42)', night: 'rgb(170, 184, 197)' },
    iconColor: { light: 'rgba(0, 0, 0, 0.42)', night: 'rgb(170, 184, 197)' },
    iconHoverColor: { light: 'black', night: '#8391a2' },
    OptionBG: { light: 'white', night: '#404954' },
    OptionLiHover: { light: '#f5f5f5', night: '#373f48' },
    OptionLiActive: { light: '#f5f5f5', night: '#373f48' },
    colorLabel: { light: '#000', night: '#b5d1eb' },
    OptionColorLiActive: { light: '#3f51b5', night: '#6973e3' }
  };
  selectInputs: ReceivedData[] = [
    { id: 0, name: 'Male' },
    { id: 1, name: 'Famle' },


  ];
  handleSelectedData(id: number) {
    this.selectResult = id - 1;
      this.register.controls['gender'].setValue(this.selectInputs[this.selectResult].id);

      }

  constructor(private http: HttpClient, private router: Router,public loader:LoaderService) {
    this.register=new FormGroup({
      name:new FormControl('',[Validators.required,Validators.minLength(3) ]),
      email:new FormControl('',[Validators.required,Validators.email]),
      password:new FormControl('',[Validators.required,Validators.minLength(8),Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[#$^+=!*()@%&]).{8,}$')]),
      confirmPassword:new FormControl('',[Validators.required,Validators.minLength(8)]),
      DOB:new FormControl('',[Validators.required]),
      gender:new FormControl(0,[Validators.required]),
      phone:new FormControl('',[Validators.required,this.lengthValidator(10) ])
    })
  }
  ngOnInit(): void {
  }


  registerNewAccount() {
    if (this.register.valid) {
      const phoneNumber = this.register.get('phone')?.value.toString();
      // Update the phone number in the form control
      this.register.get('phone')?.patchValue(phoneNumber);

      this.regiter(this.register).subscribe({
        next: (response: any) => {
          debugger
          if(response.message===''||response.message===null)
            {
          localStorage.clear();
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.name);
          localStorage.setItem('email', response.email);
          localStorage.setItem('ExpiredOn', response.expiredOn !== undefined && response.expiredOn !== null ? response.expiredOn.toString() : '');
          localStorage.setItem('IsAuthenticated', response.isAuthenticated !== undefined && response.isAuthenticated !== null ? response.isAuthenticated.toString() : '');
          localStorage.setItem('EmailConfirmed', response.emailConfirmed !== undefined && response.emailConfirmed !== null ? response.emailConfirmed.toString() : '');
          localStorage.setItem('Role', response.roles !== undefined && response.roles !== null ? response.roles.toString() : '');

          this.router.navigate(['/verify']);
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



  regiter(x:FormGroup):Observable<SignUp>
  {

   return this.http.post<SignUp>('https://localhost:7213/api/auth/register',x.value);
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
