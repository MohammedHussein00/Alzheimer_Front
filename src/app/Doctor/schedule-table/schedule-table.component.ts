import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Input, Output,OnInit } from '@angular/core';
import { Observable} from 'rxjs';
interface Appointment {
  id: number;
  appDay: Date;
  shiftId:number;
  bookingToOther: boolean;
  patientPhone: string;
  patientEmail: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  location: string;
  patientImg: string;
  appointmentStatus: string;
}
interface Clinic {
  id: number;
  examination:number;
  name: string;

}


interface Schedule {

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
  shiftId:number;
  endTime:string;
  startTime:string;
  day:string;
}


interface DoctorData {
  email: string;
  name: string;

  imgUrl: string;
  clinics: Clinic[];
  schedule: Schedule[];
}

@Component({
  selector: 'app-schedule-table',
  templateUrl: './schedule-table.component.html',
  styleUrls: ['./schedule-table.component.css']
})
export class ScheduleTableComponent implements OnInit{

  currentDate: Date = new Date();
  selectedDate: Date = new Date();
  daysInMonth: Array<any> = [];
  appointments: Appointment[] = [];
  appointmentsTemp: Appointment[] = [];
  data:DoctorData

  constructor(private http: HttpClient) {
    this.generateCalendar();
    this.data={
      email: '',
      name: '',

      imgUrl: '',
      clinics: [],
      schedule: []
    }
  }
  dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  ngOnInit(): void {
    const dayIndex = this.currentDate.getDay(); // Get the day of the week (0-6)
    const email = localStorage.getItem('email');
    if (email) {
      this.getAllAppointments(email).subscribe(data => {
        this.appointments = data;
      });
    }
    if(email)
    this.getDoctorByEmail(email).subscribe(
      (response) =>{
          this.data=response


        });
  }
  generateCalendar(): void {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const totalDaysInMonth = new Date(year, month + 1, 0).getDate();

    this.daysInMonth = [];
    for (let i = 0; i < firstDayOfMonth + totalDaysInMonth; i++) {
      this.daysInMonth.push(i >= firstDayOfMonth ? (i - firstDayOfMonth + 1) : null);
    }
  }

  selectDay(day: number): void {
    if (day) {
      this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    }
    this.select(day);
    this.getAppointment();


  }

  isSelectedDay(day: number): boolean {
    return day === this.selectedDate.getDate() &&
           this.currentDate.getMonth() === this.selectedDate.getMonth() &&
           this.currentDate.getFullYear() === this.selectedDate.getFullYear();
  }

  prevYear(): void {
    const year = this.currentDate.getFullYear() - 1; // Decrement the current year by one
    this.currentDate = new Date(year, this.currentDate.getMonth(), 1); // Set currentDate to the first day of the current month in the new year
    this.generateCalendar(); // Regenerate the calendar for the updated date
    this.getAppointment();

  }

  nextYear(): void {
    const year = this.currentDate.getFullYear() + 1; // Increment the current year by one
    this.currentDate = new Date(year, this.currentDate.getMonth(), 1); // Set currentDate to the first day of the current month in the new year
    this.generateCalendar(); // Regenerate the calendar for the updated date
    this.getAppointment();

  }


  selectMonth(monthIndex: number): void {
    const year = this.currentDate.getFullYear(); // Preserve the current year
    this.currentDate = new Date(year, monthIndex, 1); // Update currentDate to the selected month
    this.generateCalendar(); // Regenerate the calendar for the new month
    this.getAppointment();

  }

  isActiveMonth(monthIndex: number): boolean {
    return this.currentDate.getMonth() === monthIndex;
  }





  isVisible = false;


  openModal(): void {
    this.isVisible = true;
  }



  selectedClinic:number=0;
  statusOfAppointment(id: number): { statusId: number, status: string } {
    for (let i = 0; i < this.appointmentsTemp.length; i++) {
      const a = this.appointmentsTemp[i];

      if (a.shiftId === id && new Date(a.appDay) <= this.selectedDate) {
        return { statusId: 2, status: a.appointmentStatus };
      } else if (a.shiftId === id && new Date(a.appDay) >= this.selectedDate) {
        return { statusId: 1, status: a.appointmentStatus };
      }
    }

    // If no conditions matched, return a default status
    return { statusId: 3, status: '' };
  }
  getAppointmentId(id:number):Appointment{
    for (let i = 0; i < this.appointmentsTemp.length; i++) {
      const a = this.appointmentsTemp[i];
      if (a.shiftId === id) {
        return a;
      }


    }
   return this.appointmentsTemp[0];
  }
getAppointment(){
  this.appointmentsTemp=[]
  this.data.schedule.forEach(s=>{
    if(this.data.clinics[this.selectedClinic].id===s.clinicId){
      this.appointments.forEach(a=>{
        this.currDay.forEach(c=>{
        if(a.shiftId===c.shiftId)
        if(this.selectedDate.getMonth()===new Date(a.appDay).getMonth())
        if(this.selectedDate.getFullYear()===new Date(a.appDay).getFullYear())
        if(this.selectedDate.getDate()===new Date(a.appDay).getDate())
        if(!this.appointmentsTemp.some(i => i === a) // Ensure shiftId matches
      )
          this.appointmentsTemp.push(a);
      })
      })
    }
  })
}

  nextClinic() {
    if (this.selectedClinic === this.data.clinics.length - 1) {
      this.selectedClinic = 0;
    } else {
      this.selectedClinic++;
    }
    this.selectDay(this.currentDate.getDay()); // Call selectDay() to update the schedule

  }

  previousClinic() {
    if (this.selectedClinic === 0) {
      this.selectedClinic = this.data.clinics.length - 1;
    } else {
      this.selectedClinic--;
    }
    this.selectDay(this.currentDate.getDay()); // Call selectDay() to update the schedule
  }

  getAllAppointments(email: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`https://localhost:7213/api/Doctor/get-appointment-doctor?email=${encodeURIComponent(email)}`);
  }
  getDoctorByEmail(email: string): Observable<DoctorData> {
    return this.http.get<DoctorData>(`https://localhost:7213/api/Doctor/get-doctor-by-email?email=${encodeURIComponent(email)}`);
  }
  currDay:DayShift[]=[]
  select(day:number) {
    const dayOfWeek = this.currentDate.getDay();
    this.selectedDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth(), day);
    const dayIndex = this.selectedDate.getDay();
    const dayName = new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(this.selectedDate);
    const schedule = this.data.schedule.find(s => s.clinicId === this.data.clinics[this.selectedClinic].id);
    if (day) {
      if (dayName === 'Sat') {
        this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].satShifts;
      } else if (dayName === 'Sun') {
        this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].sunShifts;
      } else if (dayName === 'Mon') {
        this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].monShifts;
      } else if (dayName === 'Tue') {
        this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].tueShifts;
      } else if (dayName === 'Wed') {
        this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].wedShifts;
      } else if (dayName === 'Thu') {
        this.currDay = this.data.schedule.filter(s=>s.clinicId===this.data.clinics[this.selectedClinic].id)[0].thuShifts;
      } else if (dayName === 'Fri') {
        this.currDay = this.data.schedule.filter(s=>s.clinicId==this.data.clinics[this.selectedClinic].id)[0].friShifts;
      }
    }



  }



  convertToTimeFormat(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hoursInt = parseInt(hours, 10);
    const amPm = hoursInt >= 12 ? 'PM' : 'AM';
    const displayHours = hoursInt % 12 || 12;
    return `${displayHours}:${minutes} ${amPm}`;
  }
  calculateTimeDifferenceInMinutes(startTime: string, endTime: string): number {
    const [startHours, startMinutes] = startTime.split(':');
    const [endHours, endMinutes] = endTime.split(':');

    // Create Date objects for start and end times
    const startDate = new Date(0, 0, 0, parseInt(startHours), parseInt(startMinutes));
    const endDate = new Date(0, 0, 0, parseInt(endHours), parseInt(endMinutes));

    // Calculate time difference in milliseconds
    let timeDifferenceMs = endDate.getTime() - startDate.getTime();

    // Convert milliseconds to minutes
    const timeDifferenceMinutes = Math.floor(timeDifferenceMs / (1000 * 60));

    return Math.abs(timeDifferenceMinutes);
  }
   apps!:AppointmentDto
   revMessage:string=''
   reviewed:boolean=false
  cancelAll(){
    this.apps = {
      id: 0, // assign appropriate initial values
      bookingToOther: false,
      patientName: '',
      patientPhone: '',
      patientEmail: '',
      date: new Date(), // assign appropriate initial value
      shiftId: 0, // assign appropriate initial value
      doctorId: ''
    };
    this.appointmentsTemp.forEach(a => {
      this.apps.bookingToOther = false;
      this.apps.date = a.appDay;
      this.apps.doctorId = a.doctorName;
      this.apps.patientEmail = a.patientEmail;
      this.apps.patientName = a.patientName;
      this.apps.patientPhone = a.patientPhone;
      this.apps.shiftId = a.shiftId;
      this.apps.id = a.id;
    });
this.cancel(this.apps).subscribe(response=>{
  this.revMessage="You cancelled all  appointments of this day successfully"
  this.reviewed = true;
  setTimeout(() => {
    this.reviewed = false;
  }, 5000);
})





  }
  cancel(email: AppointmentDto):Observable<AppointmentDto[]>  {
    return this.http.post<AppointmentDto[]>("https://localhost:7213/api/Doctor/cancel-all",email);
  }

}
export interface AppointmentDto {
  id: number;
  bookingToOther: boolean;
  patientName: string;
  patientPhone: string;
  patientEmail: string;
  date: Date; // Ensure date format matches your application's requirements
  shiftId: number;
  doctorId: string;
}

