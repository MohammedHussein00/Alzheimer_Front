import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Mode } from './Mode';
import { ReceivedData } from './received-data';
import { GlobalVariablesService } from 'src/app/Service/global-variables.service';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import { SignUp } from 'src/app/Patients/register/registerRespose';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/Service/loader.service';
@Component({
  selector: 'app-register-doctor',
  templateUrl: './register-doctor.component.html',
  styleUrls: ['./register-doctor.component.css']
})
export class RegisterDoctorComponent {
  firstPage: boolean = true;
  secondPage: boolean = false;
  showPassword: boolean = false;
  showConfirmPassword: boolean = false;
  posterName: string = '';
  fileAsBase64: string|undefined = '';
  files: File[] = [];
  Message:string=''
  selectResult: number = 0;
  test: any;

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
    { id: 1, name: 'Pain Management' },
    { id: 2, name: 'Pediatric Surgery' },
    { id: 3, name: 'Pediatrics and New Born' },
    { id: 4, name: 'M Phoniatrics' },
    { id: 5, name: 'Physiotherapy and Sport Injuries' },
    { id: 6, name: 'Plastic Surgery' },
    { id: 7, name: 'Psychiatry' },
    { id: 8, name: 'Rheumatology' },
    { id: 9, name: 'Spinal Surgery' },
    { id: 10, name: 'Vascular Surgery' },
    { id: 11, name: 'Urology' },
    { id: 12, name: 'IVF and Infertility' },
    { id: 13, name: 'Laboratories' },
    { id: 14, name: 'Nephrology' },
    { id: 15, name: 'Neurology' },
    { id: 16, name: 'Neurosurgery' },
    { id: 17, name: 'Obesity and Laparoscopic Surgery' },
    { id: 18, name: 'Oncology' },
    { id: 19, name: 'Oncology Surgery' },
    { id: 20, name: 'Ophthalmology' },
    { id: 21, name: 'Orthopedics' },
    { id: 22, name: 'Osteopathy' },
    { id: 23, name: 'Ear, Nose and Throat' },
    { id: 24, name: 'Family Medicine' },
    { id: 25, name: 'Gastroenterology and Endoscopy' },
    { id: 26, name: 'General Practice' },
    { id: 27, name: 'General Surgery' },
    { id: 28, name: 'Geriatrics' },
    { id: 29, name: 'Gynaecology and Infertility' },
    { id: 30, name: 'Hematology' },
    { id: 31, name: 'Hepatology' },
    { id: 32, name: 'Internal Medicine' },
    { id: 33, name: 'Interventional Radiology' },
    { id: 34, name: 'Allergy and Immunology' },
    { id: 35, name: 'Andrology and Male Infertility' },
    { id: 36, name: 'Audiology' },
    { id: 37, name: 'Cardiology and Thoracic Surgery' },
    { id: 38, name: 'Cardiology and Vascular Disease' },
    { id: 39, name: 'Chest and Respiratory' },
    { id: 40, name: 'Dentistry' },
    { id: 41, name: 'Dermatology' },
    { id: 42, name: 'Diabetes and Endocrinology' },
    { id: 43, name: 'Diagnostic Radiology' },
    { id: 44, name: 'Dietitian and Nutrition' }
  ];


  register: FormGroup;

  constructor(public global: GlobalVariablesService, private http: HttpClient,private router:Router,public loader:LoaderService) {
    this.register = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$#^+=!*()@%&]).{8,}$')]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8)]),
      spicialization: new FormControl(this.selectInputs[this.selectResult], [Validators.required]),
      DOB: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, this.lengthValidator(10)])
    });
  }

  handleSelectedData(id: number) {
    this.selectResult = id - 1;
    console.log(this.selectResult);
  }

  registerNewAccount() {
    if (this.register.valid) {
      const formData = new FormData();

      formData.append('name',this.register.controls['name'].value);
      formData.append('email',this.register.controls['email'].value);
      formData.append('DOB',this.register.controls['DOB'].value);
      formData.append('password',this.register.controls['password'].value);
      formData.append('Specialization',this.selectInputs[this.selectResult].name);
      formData.append('phone',this.register.get('phone')?.value.toString());

      // Append the uploaded image file to the formData
      if (this.files.length > 0) {
        formData.append('Certification', this.files[0]); // Assuming only one image is uploaded
      }

      this.regiter(formData).subscribe(
        (response: SignUp) => {
          if(response.message===''||response.message===null)
            {
          localStorage.clear();
          localStorage.setItem('token', response.token);
          localStorage.setItem('name', response.name);
          localStorage.setItem('email', response.email);
          localStorage.setItem('ExpiredOn', response.expiredOn !== undefined && response.expiredOn !== null ? response.expiredOn.toString() : '');
          localStorage.setItem('IsAuthenticated', response.isAuthenticated !== undefined && response.isAuthenticated !== null ? response.isAuthenticated.toString() : '');
          localStorage.setItem('EmailConfirmed', response.emailConfirmed !== undefined && response.emailConfirmed !== null ? response.emailConfirmed.toString() : '');

          this.router.navigate(['/verify']);
            }
            else
            this.Message=response.message
        },
        (error) => {
          console.log(error);
        }
      );
    } else {
      console.log('error');
    }
  }

  regiter(x:FormData):Observable<SignUp>
  {

   return this.http.post<SignUp>('https://localhost:7213/api/auth/register-doctor',x);
  }

  lengthValidator(length: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const value = control.value;
      if (value === null || value === undefined || value === '') {
        return null;
      }
      return value.toString().length !== length ? { 'lengthError': { value: value } } : null;
    };
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  next() {
    this.firstPage = false;
    this.secondPage = true;
  }

  prev(): void {
    this.firstPage = true;
    this.secondPage = false;
  }
  onDragOver(event: DragEvent): void {
    event.preventDefault(); // Prevent default behavior
  }
  onDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files && event.dataTransfer.files.length === 1) {
      this.processFile(event.dataTransfer.files[0]);
    }
  }

  processFile(file: File): void {
    this.files = [file];
    const reader = new FileReader();
    reader.onload = () => {
      this.fileAsBase64 = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  onchange(event: any): void {
    if (event.target.files) {
      this.processFiles(event.target.files);
    }
  }

  processFiles(files: FileList): void {
    this.files = [...this.files, ...Array.from(files)];
    this.fileAsBase64 = new Array(this.files.length).toString();

    this.files.forEach((file, index) => {
      const reader = new FileReader();
      reader.onload = () => {
        this.fileAsBase64 = reader.result as string;
      };
      reader.readAsDataURL(file);
    });
  }



  removeImage(): void {
    this.fileAsBase64 = '';
    this.files = [];
  }
}
