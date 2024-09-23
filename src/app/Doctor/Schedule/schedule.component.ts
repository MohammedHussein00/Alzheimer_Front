import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Component, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/Service/loader.service';

interface Shift {
  id: number;
  day: string;
  startTime: Date;
  endTime: Date;
}

interface Schedule {
  email: string;
  id: number;
  clinicId: number;
  thisWeek: boolean;
  nextWeek: boolean;
  nextTwoWeek: boolean;
  nextThreeWeek: boolean;
  shifts: Shift[];
  name:string;
}

interface DoctorScheduleResponse {
  thisWeek: boolean;
  id: number;

  nextWeek: boolean;
  nextTwoWeek: boolean;
  clinicId:number;
  nextThreeWeek: boolean;
  shifts: ScheduleShift[];
  name:string;

}

interface ScheduleShift {
  shiftDetails: Shift[];
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css'],

})
export class ScheduleComponent implements OnInit {

  doctorName!: string | undefined;
  phoneForm!: FormGroup;
  days: any[] = [
    { name: 'Sunday', visible: false, shifts: [{ id: 0, day: 'Sunday', start: new Date(), end: new Date() }] },
    { name: 'Monday', visible: false, shifts: [{ id: 0, day: 'Monday', start: '', end: '' }] },
    { name: 'Tuesday', visible: false, shifts: [{ id: 0, day: 'Tuesday', start: '', end: '' }] },
    { name: 'Wednesday', visible: false, shifts: [{ id: 0, day: 'Wednesday', start: '', end: '' }] },
    { name: 'Thursday', visible: false, shifts: [{ id: 0, day: 'Thursday', start: '', end: '' }] },
    { name: 'Friday', visible: false, shifts: [{ id: 0, day: 'Friday', start: '', end: '' }] },
    { name: 'Saturday', visible: false, shifts: [{ id: 0, day: 'Saturday', start: '', end: '' }] }
  ];
  reviewed:boolean=false;
  revMessage:string=''
  schedulesResponse: DoctorScheduleResponse[] = [];
  schedules: Schedule[] = [];
  loading:boolean=false

  constructor(private http: HttpClient, private activatedroute: ActivatedRoute, private fb: FormBuilder,public loader:LoaderService) {

  }
  getScheduleValue(): boolean {
    // Check if schedules[selectedClinic] is defined before accessing .thisWeek
    if (this.schedules[this.selectedClinic]) {

          return this.schedules[this.selectedClinic].thisWeek || false;

      }

      return false; // Return false if schedules[this.selectedClinic] is undefined or null
  }




  ngOnInit(): void {
    this.doctorName = (this.activatedroute.snapshot.paramMap.get("bid"))?.toString().toLowerCase().replaceAll(' ', '-');


    this.calculateUpcomingSaturdays(20);

    const patientEmail = localStorage.getItem("email");
    if (patientEmail) {
      this.loading=true
      this.GetSchedule(patientEmail).subscribe((response: DoctorScheduleResponse[]) => {
        this.schedulesResponse = response
        this.schedules = response.map(scheduleResponse => ({
          email: patientEmail,
          id: scheduleResponse.id,
          clinicId: scheduleResponse.clinicId,
          thisWeek: scheduleResponse.thisWeek,
          name:scheduleResponse.name,
          nextWeek: scheduleResponse.nextWeek,
          nextTwoWeek: scheduleResponse.nextTwoWeek,
          nextThreeWeek: scheduleResponse.nextThreeWeek,
          shifts: scheduleResponse.shifts.flatMap(shift =>
            shift.shiftDetails
          )
        }));
this.loading=false;
      });







    }


  }




  checkDayFound(id: number, day: string): boolean {
    for (let i = 0; i < this.schedules[id].shifts.length; i++) {
      if (this.schedules[id].shifts[i].day === day) {
        return false;
      }
    }
    return true;
  }









  onSubmit() {
    this.loading=true;

    this.UpdateSchedule(this.schedules[this.selectedClinic]).subscribe((response)=>{
      this.loading=false;

      this.revMessage="Schedule updated successfully"
      this.reviewed = true;
      setTimeout(() => {
        this.reviewed = false;
        this.revMessage=''
      }, 20000);
    })
  }

  UpdateSchedule(x: Schedule): Observable<Schedule> {
    return this.http.post<Schedule>('https://localhost:7213/api/Doctor/update-shedule', x);
  }

  GetSchedule(x: string): Observable<DoctorScheduleResponse[]> {
   const y={"email":x}
    return this.http.post<DoctorScheduleResponse[]>("https://localhost:7213/api/Doctor/get-schedule",y);
  }

  calculateUpcomingSaturdays(weeksAhead: number): void {
    // Implementation here
  }

  toggleInput() {
    // Implementation here
  }

  addShift(day: any, scheduleId: number) {
    const id = this.schedules[scheduleId].shifts.length > 0 ? this.schedules[scheduleId].shifts[0].id + 1 : 0;
    const newShift: Shift = {
      id:0,
      day: day.name.substring(0, 3),
      startTime: new Date(), // Provide a valid start time here
      endTime: new Date()   // Provide a valid end time here
    };
    this.schedules[scheduleId].shifts.unshift(newShift);
  }



  removeShift(day: any, index: number) {
    console.log(index)
    // Check if there is more than one shift for the selected clinic
    if (this.schedules[this.selectedClinic].shifts.length > 1) {
      // Check if the index is 0 (first shift)

        // Remove the shift at the specified index
        this.schedules[this.selectedClinic].shifts.splice(index, 1);

    }
  }


  toggleVisibility(day: any) {
    day.visible = !day.visible;
  }
  convertToTime(timeString: string | undefined): string {
    if (!timeString) {
      return ''; // Return an empty string or handle the case appropriately
    }

    // Split the timeString to extract hours, minutes, and meridian (AM/PM)
    const [time, meridian] = timeString.split(' ');
    const [hours, minutes] = time.split(':');

    // Convert hours to 24-hour format if necessary
    let convertedHours = parseInt(hours, 10);
    if (meridian === 'PM' && convertedHours !== 12) {
      convertedHours += 12;
    } else if (meridian === 'AM' && convertedHours === 12) {
      convertedHours = 0;
    }

    // Create a new Date object with the adjusted hours and minutes
    const date = new Date();
    date.setHours(convertedHours, parseInt(minutes, 10));

    // Format the time string in HH:mm format
    const formattedTime = date.toTimeString().slice(0, 5);

    return formattedTime;
  }

selectedClinic:number=0;




  nextClinic() {
    if (this.selectedClinic===this.schedules.length-1)
      this.selectedClinic = 0;
    else
    this.selectedClinic++;
  }

  previousClinic() {
    if (this.selectedClinic===0)
      this.selectedClinic = this.schedules.length-1;
    else
    this.selectedClinic--;
  }
}
