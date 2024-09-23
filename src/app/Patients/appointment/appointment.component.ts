import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoaderService } from 'src/app/Service/loader.service';


interface Appointment {
  id: number;
  appDay: Date;
  bookingToOther: boolean;
  patientPhone: string;
  patientEmail: string;
  patientName: string;
  patientId: string;
  doctorName: string;
  location: string;
  appointmentStatus: string;
}

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {
  appointments: Appointment[] = [];
  reviewed:boolean=false
  revMessage:string=''
  constructor(private http: HttpClient,public loader:LoaderService) { }

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.getAllAppointments(email).subscribe(data => {
        this.appointments = data;
      });
    }
  }
  isAppointmentMoreThan60Minutes(appointmentDate: Date): boolean {
    const appointmentTime = new Date(appointmentDate).getTime(); // Convert appointment date to milliseconds
    const currentTime = new Date().getTime(); // Get current date/time in milliseconds

    // Calculate the time difference in minutes
    const timeDifferenceMinutes = Math.abs((appointmentTime - currentTime) / (1000 * 60));

    // Check if time difference is greater than 60 minutes
    return timeDifferenceMinutes > 60;
  }

cancel(a:Appointment){
  this.appointments.forEach(A=>{
    if(a.id==A.id)
      A.appointmentStatus='Cancelled'

  })
if(this.isAppointmentMoreThan60Minutes(a.appDay))
  this.cancelAppointment(a.id).subscribe(response=>{
    const email = localStorage.getItem('email');

    if (email) {
      this.getAllAppointments(email).subscribe(data => {

        this.appointments = data;
        this.revMessage="Cancel operation done successfully"
        this.reviewed = true;
        setTimeout(() => {
          this.reviewed = false;
        }, 5000);
      });
    }
  })
  else{
  this.revMessage="You can not cancel this appointment"
  this.reviewed = true;
  setTimeout(() => {
    this.reviewed = false;
  }, 5000);
}
}

  getAllAppointments(email: string): Observable<Appointment[]> {
    return this.http.get<Appointment[]>(`https://localhost:7213/UserService/get-appointment-patient?email=${encodeURIComponent(email)}`);
  }
  cancelAppointment(email: number): Observable<any> {
    return this.http.get<any>(`https://localhost:7213/UserService/cancel?id=${(email)}`);
  }
}
