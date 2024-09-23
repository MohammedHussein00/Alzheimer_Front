// detection-result.component.ts

import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export interface DetectionMRI {
  id: number;
  mriUrl: string;
  result: string;
}
export interface Detection {
  id: number;
  date: Date;
  patientId: number; // Assuming it's a number based on your JSON
  detectionMRIs: DetectionMRI[];
}

@Component({
  selector: 'app-detection-result',
  templateUrl: './detection-result.component.html',
  styleUrls: ['./detection-result.component.css']
})
export class DetectionResultComponent implements OnInit{

  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  daysInMonth: Array<number | null> = [];
  months: Array<string> = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  currentPage: number = 1;
  itemsPerPage: number = 10;
  currentIndex:number=0
  selectedDay: number | null = null; // Track selected day
  detection:Detection[]=[]
  filteredDetection:Detection[]=[]
  constructor(private http:HttpClient) {

  }
  ngOnInit(): void {
    this.generateCalendar();
    this.selectDay(new Date().getDate())
    this.currentIndex=new Date().getDate();
    var email= localStorage.getItem('email');
    if(email)
      this.getDetectionsByEmail(email).subscribe((response:Detection[])=>{
    this.detection=response;
    for (let i = 0; i < this.detection.length; i++) {
      for (let j = 0; j < this.detection[i].detectionMRIs.length; j++) {
          // Remove the initial DoctorData\\mh21562@fayoum.edu.eg\\ from the imageUrl
          let imageUrl = this.detection[i].detectionMRIs[j].mriUrl.replace('E:\\Angular Projects\\GradProject\\Alzheimer\\DoctorData\\', 'DoctorData\\');

          // Replace backslashes with forward slashes
          imageUrl = imageUrl.replace(/\\/g, '/');

          // Update the imageUrl with the corrected path
          this.detection[i].detectionMRIs[j].mriUrl = imageUrl;
      } 
    }
    this.detection.forEach(element => {
      const date = new Date(element.date);

// Extract year, month, and day using Date methods
const year = date.getFullYear();
const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
const day = date.getDate();
      if(year===this.currentDate.getFullYear()&&month==this.currentDate.getMonth()+1&&day===this.currentDate.getDate())
        this.filteredDetection.push(element)
        console.log(year===this.currentDate.getFullYear(),year,this.currentDate.getFullYear(),month,this.currentDate.getMonth()+1,day,this.currentDate.getDate())
     });

});


  }
getNameOfImage(name:string){

return name.replace(`DoctorData/${localStorage.getItem('email')}/Detection/`,'');
}
selecteMRI:DetectionMRI= { id: 0, mriUrl: '', result: '' };

selectDetection(id:number,DetectionMRIId:number){
  this.selecteMRI.id=this.filteredDetection[id].detectionMRIs[DetectionMRIId].id;
  this.selecteMRI.result=this.filteredDetection[id].detectionMRIs[DetectionMRIId].result;
  this.selecteMRI.mriUrl=this.filteredDetection[id].detectionMRIs[DetectionMRIId].mriUrl;
}
  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    for (let i = 0; i < totalDaysInMonth; i++) {
      this.daysInMonth.push(i + 1);
    }


  }

  selectMonth(monthIndex: number): void {
    this.currentDate.setMonth(monthIndex);
    this.generateCalendar();


    this.filteredDetection=[]
    this.detection.forEach(element => {
      const date = new Date(element.date);

// Extract year, month, and day using Date methods
const year = date.getFullYear();
const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
const day = date.getDate();
      if(year===this.selectedDate.getFullYear()&&month==this.selectedDate.getMonth()+1&&day===this.selectedDate.getDate())
        this.filteredDetection.push(element)
        console.log(year===this.selectedDate.getFullYear(),year,this.selectedDate.getFullYear(),month,this.selectedDate.getMonth()+1,day,this.currentDate.getDate())
     });

  }

  isActiveMonth(monthIndex: number): boolean {
    return this.currentDate.getMonth() === monthIndex;
  }

  previousMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() - 1);
    this.generateCalendar();
    this.detection.forEach(element => {
      console.log(this.filteredDetection,this.currentDate.toString().split('T')[0],element.toString().split('T')[0])
      if(element.toString().split('T')[0]===this.currentDate.toString().split('T')[0])
        this.filteredDetection.push(element)
        
     });
  }

  nextMonth(): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + 1);
    this.generateCalendar();
    this.detection.forEach(element => {
      console.log(this.filteredDetection,this.currentDate.toString().split('T')[0],element.toString().split('T')[0])
      if(element.toString().split('T')[0]===this.currentDate.toString().split('T')[0])
        this.filteredDetection.push(element)
        
     });
  }

  selectDay(day: number | null): void {
    if (day !== null) {
      const newDate = new Date(this.selectedDate);
      newDate.setDate(day);
      this.selectedDate = newDate;
      this.selectedDay = day; // Update selected day

    }


    this.filteredDetection=[]

    this.detection.forEach(element => {
      const date = new Date(element.date);

const year = date.getFullYear();
const month = date.getMonth() + 1; // Months are zero-indexed, so add 1
const day = date.getDate();
      if(year===this.selectedDate.getFullYear()&&month==this.selectedDate.getMonth()+1&&day===this.selectedDate.getDate())
        this.filteredDetection.push(element)
        console.log(year===this.selectedDate.getFullYear(),year,this.selectedDate.getFullYear(),month,this.selectedDate.getMonth()+1,day,this.selectedDate.getDate())
     });

  }



  goToNextPage(): void {
    if (this.daysInMonth.filter(day => day !== null).length > this.currentIndex + 10) {
      this.currentIndex++;
    }
    console.log(this.daysInMonth, this.currentPage)
  }

  goToPreviousPage(): void {
    if (this.currentIndex >= 1) {
      this.currentIndex--;
    }
  }

  getDisplayedDays(): number[] {
    const start = 0; // Number of days to display
    const end = 0; // Number of days to display
    console.log(this.daysInMonth.length)
    if (this.currentIndex >= 5 && this.daysInMonth.length - this.currentIndex >= 4) {
      // Display a range of 9 days centered around currentIndex
      return this.daysInMonth
                 .slice(this.currentIndex - 5, this.currentIndex + 5)
                 .filter(day => day !== null) as number[];
    } else {
      if(this.daysInMonth.length-this.currentIndex>=5)

      return this.daysInMonth
                 .slice(0,  10)
                 .filter(day => day !== null) as number[];

     else

      return this.daysInMonth
                 .slice(this.daysInMonth.length-10,  this.daysInMonth.length)
                 .filter(day => day !== null) as number[];
    }
  }


  isSelectedDay(day: number): boolean {
    return day === this.selectedDay;
  }
  getDetectionsByEmail(email: string): Observable<Detection[]> {
    return this.http.get<Detection[]>(`https://localhost:7213/api/Doctor/get-detection-by-email?email=${email}`);
  }
  getHours_Munits(date:Date){
    return date.toString().split('T')[1]
  }
}
