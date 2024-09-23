import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GetDoctor } from '../Doctor/doctor-profile/GetDoctor';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.component.html',
  styleUrls: ['./doctors.component.css']
})
export class DoctorsComponent {
  clearForm!: FormGroup;
  showClear: boolean = false;
  noResult: boolean = false;
  doctors: Doctorinfo[] = [];
  tempDoctors:Doctorinfo[]=[]

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.clearForm = new FormGroup({
      inputVal: new FormControl('')
    });

    this.clearForm.get('inputVal')?.valueChanges.subscribe(val => {
      this.showClear = val.length > 0;
    });

    this.GetDoctors().subscribe(data => {
      this.doctors = data;
      this.tempDoctors = data;
    ///////
    if (this.tempDoctors) {
      this.tempDoctors = this.tempDoctors.map(d => {
        if (d && d.imgUrl) {
          d.imgUrl = d.imgUrl.replace('E:\\Angular Projects\\GradProject\\Alzheimer\\DoctorData\\', 'DoctorData\\').replace(/\\/g, '/');
        }
        return d;
      });
    } else {
      console.error('this.tempDoctors is null or undefined');
    }
    ///////
    if (this.doctors) {
      this.doctors = this.doctors.map(d => {
        if (d && d.imgUrl) {
          d.imgUrl = d.imgUrl.replace('E:\\Angular Projects\\GradProject\\Alzheimer\\DoctorData\\', 'DoctorData\\').replace(/\\/g, '/');
        }
        return d;
      });
    } else {
      console.error('this.tempDoctors is null or undefined');
    }


    });
  }

  handleFocus() {
    if (this.clearForm.get('inputVal')?.value) {
      this.showClear = true;
    }
  }

  handleBlur() {
    this.showClear = false;
  }

  GetDoctors(): Observable<Doctorinfo[]> {
    return this.http.get<Doctorinfo[]>('https://localhost:7213/UserService/get-doctors');
  }

  clearValue() {
    this.clearForm.get('inputVal')?.setValue('');
  }
  percentageRating:number=0
  calcRating(rate1: number, rate2: number, rate3: number, rate4: number, rate5: number): number {
    var totalRatings = rate1 + rate2 + rate3 + rate4 + rate5;

    // Check if the total number of ratings is zero to avoid division by zero
    if (totalRatings === 0) {
      return 0; // or some other value that indicates no ratings are available
    }
    var percentageRating = Math.floor((rate1 + (2 * rate2) + (3 * rate3) + (4 * rate4) + (5 * rate5)) /
      totalRatings / 5 * 100);
    percentageRating = Math.floor(100 - ((percentageRating - Math.floor(percentageRating)) * 100));
    percentageRating = Math.floor(percentageRating);
    this.percentageRating= percentageRating / 100 * 5;
    return percentageRating / 100 * 5;
  }
  parse(percentageRating:number){
    return parseInt((percentageRating).toString())
  }
fillStars:number= parseInt((this.percentageRating).toString())
  filterByName(): void {
    this.doctors=this.tempDoctors
    const inputValue = this.clearForm.controls['inputVal'].value.toLowerCase();
    this.doctors = this.doctors.filter(doctor =>
      doctor.name.toLowerCase().includes(inputValue)
    );
    if(!this.doctors[0])
      this.noResult=true
      }

}

export interface Doctorinfo {
  id: string;
  name: string;
  smallTip: string;
  specialization: string;
  AboutDoctor: string;
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  phoneNumber: string;
  examination: string; // Adjust type based on actual data type
  location: string;
  imgUrl: string;
}
