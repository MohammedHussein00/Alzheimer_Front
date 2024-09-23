import { Component, SimpleChanges } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { GlobalVariablesService } from 'src/app/Service/global-variables.service';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs'
import { SignUp } from 'src/app/Patients/register/registerRespose';
import { ActivatedRoute, Router } from '@angular/router';
import { GetDoctor } from '../Doctor/doctor-profile/GetDoctor';
import { Mode } from '../Doctor/register-doctor/Mode';
import { ReceivedData } from '../select-list/received-data';
export interface Profile{
  name:string;
  email:string;
  dob:string;
  phone:string;
  gender:number;
  photo:File|null;
  currentEmail:string|null;
}

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent {
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
    { id: 0, name: 'Male' },
    { id: 1, name: 'Famle' },


  ];
  //#endregion



  constructor(private http:HttpClient,private activatedroute:ActivatedRoute,private router:Router) {
    this.profile={
      name:'',
      email:'',
      gender:0,
      dob:'',
      phone:'',
      currentEmail:'',
      photo:null
    }
    }
    ngOnChanges(changes: SimpleChanges): void {
      this.date.valueChanges.subscribe(selectedDate => {
        console.log(selectedDate);
      });
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

    onchange(event: any){
      if(event.target.files[0].type!="application/pdf")
      {

           const file =event.target.files[0];
           this.profile.photo=file
           let reader1 = new FileReader();
           reader1.readAsDataURL(file);
           reader1.onload = () => {
           this.base64= reader1.result?.toString();


           }
      }
    }
    update()
    {

      this.profile.currentEmail=localStorage.getItem('email');
      const form = new FormData();

      // Append photo only if it is not null
      if (this.profile.photo !== null) {
        form.append('photo', this.profile.photo, this.profile.photo.name);
      }

      form.append('name', this.profile.name);
      form.append('email', this.profile.email);
      form.append('phone', this.profile.phone);
      form.append('dob', this.profile.dob);
      form.append('smallTip', "this.profile.smallTip");
      form.append('specialization', "this.profile.specialization");
      form.append('aboutDoctor', "this.profile.aboutDoctor");
      if (this.profile.currentEmail !== null)

      form.append('currentEmail', this.profile.currentEmail);
      if(this.profile.currentEmail!==null){
        this.regiter(form).subscribe(data=>{

          this.router.navigate(['/user-profile',data.email]);
        })
      }

    }
    regiter(x:FormData):Observable<Profile>
    {
     return this.http.post<Profile>('https://localhost:7213/api/auth/update-pateint',x);
    }

  isFormValid(): boolean {
    const phoneNumber = String(this.profile.phone).replace(/^0+/, ''); // Convert phone number to string and remove leading zeros

    if (
      this.profile.photo!==null &&
        this.profile.name.length >= 3 &&
        (phoneNumber.length === 10) &&
        this.profile.dob.length >= 1 &&
        this.profile.email.includes('@')) { // Check if email contains '@'
      return true; // Return true if all fields meet the length and email format requirements
    }
    return false; // Return false if any field does not meet the requirements
  }
  handleSelectedData(id: number) {
    this.selectResult = id - 1;
    this.profile.gender=this.selectInputs[this.selectResult].id;
  }
}
