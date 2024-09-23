import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, HostListener, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
interface Clinic {
  id: number;
  location: string;
  examination: number;
  discription: string;
  name: string;
  phone: string;
  images: Image[];
  assistants: Assistant[];
}
  interface AppointmentDto {
      bookingToOther: boolean;
      patientName: string;
      patientPhone: string;
      patientEmail: string;
      date: Date;
      shiftId: number;
      doctorId: string;
  }


interface Image {
  imageUrl: string;
}

interface Assistant {
  number: string;
  name: string;
}

interface Schedule {
  thisWeek: boolean;
  nextWeek: boolean;
  nextTwoWeek: boolean;
  nextTreeWeek: boolean;
  clinicId:number;
  satShifts: DayShift[];
  sunShifts: DayShift[];
  monShifts: DayShift[];
  tueShifts: DayShift[];
  wedShifts: DayShift[];
  thuShifts: DayShift[];
  friShifts: DayShift[];
}
interface DayShift{
  id:number;
  shiftId:number;
  endTime:string;
  startTime:string;
  day:string;
  available:boolean;
}
interface DoctorData {
  email: string;
  name: string;
  specialization: string;
  smallTip: any; // Define the type if known
  aboutDoctor: any; // Define the type if known
  rate1: number;
  rate2: number;
  rate3: number;
  rate4: number;
  rate5: number;
  phoneNumber: string;
  imgUrl: string;
  clinics: Clinic[];
  review: Review[]; // Define the type if known
  schedule: Schedule[];
}
interface Review {
  date: string;
  id: number;
  name: string;
  patientId: number;
  imgUrl: string;
  likes: number;
  numOfStars:number;
  dislikes: number;
  review: string;
}
interface AddReview {
  doctorId: string;
  patientEmail: string|null;

  numOfStars:number;

  review: string;
}
interface Increment {
  newNumber: number;
  id: number;

}


@Component({
  selector: 'app-doctor-detials',
  templateUrl: './doctor-detials.component.html',
  styleUrls: ['./doctor-detials.component.css']
})
export class DoctorDetialsComponent {

  doctorId:string|undefined='';
  reviewed:boolean=false;
  percentageRating:number=0
  data:DoctorData
  RemPercentage:number=0;
  appointment:AppointmentDto;
  addReview:AddReview
  constructor(private http:HttpClient,private activatedroute:ActivatedRoute) {
    this.data={
      email: '',
      name: '',
      specialization: '',
      smallTip: '', // Define the type if known
      aboutDoctor: '', // Define the type if known
      rate1: 0,
      rate2: 0,
      rate3: 0,
      rate4: 0,
      rate5: 0,
      phoneNumber: '',
      imgUrl: '',
      clinics: [],
      review: [], // Define the type if known
      schedule: []
    }
    this.appointment={
      bookingToOther:false,
      patientName:this.data.name,
      patientPhone:this.data.phoneNumber,
      doctorId:'',
      patientEmail:this.data.email,
      shiftId:0,
      date:new Date()
    };
    this.addReview={
      doctorId:'',
      patientEmail:'',
      numOfStars:0,
      review:''
    }
    const numDays = 30; // Number of days to display

  for (let i = 0; i < numDays; i++) {
    const currentDate = new Date();
    currentDate.setDate(currentDate.getDate() + i);

    const dayOfWeek = this.getDayOfWeek(currentDate.getDay());
    const timeRanges = this.generateTimeRanges(); // Generate time ranges for each day

    this.schedule.push({ date: currentDate, day: dayOfWeek, times: timeRanges });
  }
  }

  ngOnInit(): void {
    this.doctorId=(this.activatedroute.snapshot.paramMap.get("bid"))?.toString().toLowerCase().replaceAll(' ','-');
    if(this.doctorId)
this.getDoctorByEmail(this.doctorId).subscribe(
(response) =>{
    this.data=response
    for (let i = 0; i < this.data.clinics.length; i++) {
      for (let j = 0; j < this.data.clinics[i].images.length; j++) {
          // Remove the initial DoctorData\\mh21562@fayoum.edu.eg\\ from the imageUrl
          let imageUrl = this.data.clinics[i].images[j].imageUrl.replace('E:\\Angular Projects\\GradProject\\Alzheimer\\DoctorData\\', 'DoctorData\\');

          // Replace backslashes with forward slashes
          imageUrl = imageUrl.replace(/\\/g, '/');

          // Update the imageUrl with the corrected path
          this.data.clinics[i].images[j].imageUrl = imageUrl;
      }
  }
  this.selectDay();

  this.appointment.patientName=this.data.name
  const test=localStorage.getItem("email")
  if(test)
  this.appointment.patientEmail=test;

  this.appointment.patientPhone=this.data.phoneNumber

  });


}
getDoctorByEmail(id: string): Observable<DoctorData> {
  return this.http.get<DoctorData>(`https://localhost:7213/UserService/get-doctor-by-id?id=${id}`);
}








      isModalOpen = false;

      openModal() {
        this.isModalOpen = true;
      }

      closeModal() {
        this.isModalOpen = false;
      }

      @HostListener('document:keydown', ['$event'])
      handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Escape' && this.isModalOpen) {
          this.closeModal();
        }
      }
      checkboxStates: boolean[] = [false, false, false, false, false]; // Array to store checkbox states

  updateSelectedRating(index: number) {
    // Update checkbox states array
    this.checkboxStates = this.checkboxStates.map((state, i) => i === index);
    for(let i=0;i<5;i++)
      if(this.checkboxStates[i]===true)
        this.numOfStar=i+1;
  }
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

    revMessage:string=''
    numOfStar:number=0;
    @ViewChild('review') reviewTextArea!: ElementRef;
    addNewReview() {
      this.addReview.numOfStars = this.numOfStar;
      this.addReview.doctorId = this.data.email;
      this.addReview.patientEmail = localStorage.getItem("email");
      this.addReview.review = this.reviewTextArea.nativeElement.value;
      console.log(this.addReview);

      // Specify responseType as text
      this.http.post("https://localhost:7213/UserService/add-review", this.addReview, { responseType: 'text' }).subscribe(
        (response: string) => {
          this.revMessage = response;
          console.log(response);
          this.ngOnInit();
          if (response === 'You reviewed this Doctor before') {
            this.reviewed = true;
            setTimeout(() => {
              this.reviewed = false;
            }, 5000);
          }
        },
        (error) => {
          // Handle error
          console.error('Error:', error);
        }
      );
    }
increment: Increment = { id: 0, newNumber: 0 };
liked:boolean[]=[]
disliked:boolean[]=[]
incrementLikes(rate: any) {
  console.log(rate);
  if (this.liked[rate]) {
    this.data.review[rate].likes--;
    this.liked[rate] = false;




  } else {
    this.data.review[rate].likes++;
    this.liked[rate] = true;
  }
  this.increment.id=this.data.review[rate].id
  this.increment.newNumber=this.data.review[rate].likes;
  console.log(this.increment)
  this.http.post("https://localhost:7213/UserService/increment-likes",this.increment).subscribe(
    (response)=>{
      this.revMessage=response.toString()
      this.ngOnInit();
    }
  )
}


incrementDislikes(rate: any) {
  if (this.disliked[rate]) {
    this.data.review[rate].dislikes--;
    this.disliked[rate] = false;

  } else {
    this.data.review[rate].dislikes++;
    this.disliked[rate] = true;
  }
  this.increment.id=this.data.review[rate].id
  this.increment.newNumber=this.data.review[rate].dislikes;
  this.http.post("https://localhost:7213/UserService/increment-dislikes",this.increment).subscribe(
    (response)=>{

      this.ngOnInit();
    }
  )
}

bookAppointment(id:number) {
  if(this.doctorId)
  this.appointment.doctorId=this.doctorId;
  this.appointment.shiftId=id;
  this.appointment.date=this.schedule[this.currentIndex].date;
  console.log(this.appointment)

  this.http.post<any>("https://localhost:7213/UserService/book-appointment",this.appointment).subscribe(
    (response) => {
      this.revMessage = response.data;
      console.log(response);
      this.ngOnInit();
      if (response.data === 'Your Booking compelelte successfully') {
        this.reviewed = true;
        setTimeout(() => {
          this.reviewed = false;
        }, 5000);
      }
    },
    (error) => {
      // Handle error
      console.error('Error:', error);
    }
  );
}





schedule: { date: Date, day: string, times: string[][] }[] = [];
currentIndex: number = 0;



// Function to generate time ranges for each day
private generateTimeRanges(): string[][] {
  // This is a placeholder, you can modify this to include actual schedule for each day
  return [
    ['08:00 AM', '10:00 AM'],
    ['11:00 AM', '01:00 PM'],
    ['02:00 PM', '04:00 PM']
  ];
}

// Function to get day of the week from a number (0-6)
private getDayOfWeek(dayIndex: number): string {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return days[dayIndex];
}

// Function to move to the next week
nextWeek() {
  const numWeeks = 1; // Number of weeks to move
  this.currentIndex += numWeeks;
  this.selectDay();

}

// Function to move to the previous week
previousWeek() {
  const numWeeks = 1; // Number of weeks to move
  this.currentIndex -= numWeeks;
  this.selectDay();

}
















///////////////////////////////
selectedClinic:number=0;
selectedSchedule:number=0;




nextClinic() {
  if (this.selectedClinic === this.data.clinics.length - 1) {
    this.selectedClinic = 0;
  } else {
    this.selectedClinic++;
  }
  this.selectDay(); // Call selectDay() to update the schedule
}

previousClinic() {
  if (this.selectedClinic === 0) {
    this.selectedClinic = this.data.clinics.length - 1;
  } else {
    this.selectedClinic--;
  }
  this.selectDay(); // Call selectDay() to update the schedule
}


  convertToTimeFormat(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hoursInt = parseInt(hours, 10);
    const amPm = hoursInt >= 12 ? 'PM' : 'AM';
    const displayHours = hoursInt % 12 || 12;
    return `${displayHours}:${minutes} ${amPm}`;
  }
  currDay:DayShift[]=[]
  selectDay() {
    if (this.schedule[this.currentIndex].day === 'Sat') {
      this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].satShifts;
    } else if (this.schedule[this.currentIndex].day === 'Sun') {
      this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].sunShifts;
    } else if (this.schedule[this.currentIndex].day === 'Mon') {
      this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].monShifts;
    } else if (this.schedule[this.currentIndex].day === 'Tue') {
      this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].tueShifts;
    } else if (this.schedule[this.currentIndex].day === 'Wed') {
      this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].wedShifts;
    } else if (this.schedule[this.currentIndex].day === 'Thu') {
      this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].thuShifts;
    } else if (this.schedule[this.currentIndex].day === 'Fri') {
      this.currDay = this.data.schedule.filter(s=>s.clinicId==this.data.clinics[this.selectedClinic].id)[0].friShifts;
    }

  }

}
