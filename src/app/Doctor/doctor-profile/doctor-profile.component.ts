import { Component, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { ReceivedData } from '../register-doctor/received-data';
import { Mode } from '../register-doctor/Mode';
import { GlobalVariablesService } from 'src/app/Service/global-variables.service';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import { SignUp } from 'src/app/Patients/register/registerRespose';
import { ActivatedRoute, Router } from '@angular/router';
import { Profile } from './Profile';
import { GetDoctor } from './GetDoctor';
import { LoaderService } from 'src/app/Service/loader.service';

@Component({
  selector: 'app-doctor-profile',
  templateUrl: './doctor-profile.component.html',
  styleUrls: ['./doctor-profile.component.css']
})
export class DoctorProfileComponent {
  base64:string|undefined='assets/profile1.png'
  userName:string=''
  date = new FormControl(new Date());
  serializedDate = new FormControl(new Date().toISOString());
  selectResult: number = 0;
  profile:Profile;

  //#region
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
  //#endregion
  revMessage:string=''
  reviewed:boolean=false
  constructor(private http:HttpClient,private activatedroute:ActivatedRoute,private router:Router,public loader:LoaderService) {
    this.profile={
      name:'',
      email:'',
      dob:'',
      phone:'',
      smallTip:'',
      specialization:'',
      aboutDoctor:'',
      currentEmail:'',
      photo:null
    }
    }
    ngOnChanges(changes: SimpleChanges): void {
      this.date.valueChanges.subscribe(selectedDate => {
        console.log(selectedDate);
      });
    }

    handleSelectedData(id: number) {
      this.selectResult = id - 1;
      this.profile.specialization=this.selectInputs[this.selectResult].name;
    }

    ngOnInit(): void {
      const currentEmail = localStorage.getItem('email');
      if (currentEmail) {
        this.getDoctor(currentEmail).subscribe(
          (response) => {
            this.profile.name = response.name;
            this.profile.email = response.email;
            this.profile.dob = response.dob;
            this.profile.phone = response.phoneNumber;
            this.profile.smallTip = response.smallTip;
            this.profile.specialization = response.specialization;
            this.profile.aboutDoctor = response.aboutDoctor;
            this.profile.currentEmail = response.email;
          },
          (error) => {
            // Handle error
            console.error('Error fetching doctor:', error);
          }
        );
      }

      this.userName = String(this.activatedroute.snapshot.paramMap.get('Name'));
    }

    getDoctor(email: string): Observable<GetDoctor> {
      const body = { email: email };

      return this.http.post<GetDoctor>('https://localhost:7213/api/Doctor/doc-uodate',body);
    }

    onchange(event: any) {
      if (event.target.files && event.target.files.length > 0) {
        const file = event.target.files[0];
        if (file.type !== "application/pdf") {
          this.profile.photo = file;

          const reader = new FileReader();
          reader.onload = () => {
            this.base64 = reader.result as string;
          };
          reader.readAsDataURL(file);
        } else {
          // Handle the case where the file type is not supported (PDF in this case)
          console.error("Unsupported file type");
        }
      }
    }

    update() {
      this.profile.currentEmail = localStorage.getItem('email');

      const form = new FormData();

      // Append photo only if it is not null
      if (this.profile.photo !== null) {
        form.append('photo', this.profile.photo, this.profile.photo.name);
      }

      form.append('name', this.profile.name);
      form.append('email', this.profile.email);
      form.append('phone', this.profile.phone);
      form.append('dob', this.profile.dob);
      form.append('smallTip', this.profile.smallTip);
      form.append('specialization', this.profile.specialization);
      form.append('aboutDoctor', this.profile.aboutDoctor);
      if (this.profile.currentEmail !== null)

      form.append('currentEmail', this.profile.currentEmail);

      if (this.profile.currentEmail !== null) {
        this.regiter(form).subscribe(
          data => {
            this.revMessage="Your profile updated Successfully"
            this.reviewed = true;
            setTimeout(() => {
              this.reviewed = false;
            }, 5000);
            localStorage.setItem('imgURL',`DoctorData/${this.profile.currentEmail}/${this.profile.photo?.name+'.jpg'}`)
          },
          error => {
            // Handle error
            console.error('Error updating profile:', error);
          }
        );
      }
    }

    regiter(x:FormData):Observable<Profile>
    {
     return this.http.post<Profile>('https://localhost:7213/api/auth/update-doctor',x);
    }

  isFormValid(): boolean {
    const phoneNumber = String(this.profile.phone).replace(/^0+/, ''); // Convert phone number to string and remove leading zeros

    if (
      this.profile.photo!==null &&
      this.profile.specialization.length >= 1 &&
        this.profile.name.length >= 3 &&
        this.profile.smallTip.length >= 10 &&
        (phoneNumber.length === 10) &&
        this.profile.dob.length >= 1 &&
        this.profile.aboutDoctor.length >= 50 &&
        this.profile.email.includes('@')) { // Check if email contains '@'
      return true; // Return true if all fields meet the length and email format requirements
    }
    return false; // Return false if any field does not meet the requirements
  }

}
