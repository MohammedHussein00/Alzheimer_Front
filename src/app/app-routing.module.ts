import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { CommonModule } from '@angular/common';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { RegisterComponent } from './Patients/register/register.component';
import { LoginComponent } from './Patients/register/login/login.component';
import { RegisterDoctorComponent } from './Doctor/register-doctor/register-doctor.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { DoctorDetialsComponent } from './doctor-detials/doctor-detials.component';
import { DetectionComponent } from './detection/detection.component';
import { DoctorHomeComponent } from './Doctor/doctor-home/doctor-home.component';
import { ScheduleComponent } from './Doctor/Schedule/schedule.component';
import { NoScheduleComponent } from './Doctor/no-schedule/no-schedule.component';
import { ScheduleTableComponent } from './Doctor/schedule-table/schedule-table.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DetectionResultComponent } from './Doctor/detection-result/detection-result.component';
import { DoctorProfileComponent } from './Doctor/doctor-profile/doctor-profile.component';
import { ClinicComponent } from './Doctor/clinic/clinic.component';
import { AuthGuard } from './Service/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { VerificationComponent } from './verification/verification.component';
import { AppointmentComponent } from './Patients/appointment/appointment.component';
import { DetectionHomeComponent } from './Doctor/detection-home/detection-home.component';
import { DashDoctorsComponent } from './Admin/dash-doctors/dash-doctors.component';
import { DashDoctorDetialsComponent } from './Admin/dash-doctor-detials/dash-doctor-detials.component';
import { HomeDetectionPatientComponent } from './Admin/home-detection-patient/home-detection-patient.component';
import { PatientDetectionComponent } from './Admin/patient-detection/patient-detection.component';
import { MessageComponent } from './message/message.component';

// www.sunrise.com   localhost:4200   |   // www.sunrise.com/employees      localhost:4200/employees
const routes: Routes = [

  {path:'',redirectTo:'/Home',pathMatch:'full'},

  {path:'Home',component:WelcomeComponent},

  {path:'',component:AdminLayoutComponent,children:[
    {path:'dashboard',component:DashboardComponent},
    {path:'dash/dr/:bid',component:DashDoctorDetialsComponent},
    {path:'dash/doctors',component:DashDoctorsComponent},


  ]},
  {path:'',component:HomeComponent,children:[
    {path:'',redirectTo:'/Home',pathMatch:'full'},
    {path:'doctors',component:DoctorsComponent,canActivate:[AuthGuard] },
    { path: "welcome", component: WelcomeComponent },
    { path: "appointments", component: AppointmentComponent },
    {path:'dr/:bid',component:DoctorDetialsComponent},
    {path:'chat/:bid',component:MessageComponent},
    {path:'profile',component:UserProfileComponent},
    {path:'d',component:HomeDetectionPatientComponent,children:[

      {path:'detection',component:PatientDetectionComponent}
    ]}


  ]},
  {path:'doctor',component:DoctorHomeComponent,children:[
    {path:'chat/:bid',component:MessageComponent},

    {path:'schedule',component:NoScheduleComponent},
    {path:'d',component:DetectionHomeComponent,children:[
    {path:'detection',component:DetectionComponent},

    {path:'history',component:DetectionResultComponent}
    ]},
    {path:'profile',component:DoctorProfileComponent},
    {path:'clinic',component:ClinicComponent},

    {path:'schedule-update/:doctorName',component:ScheduleComponent},
    {path:'schedule-table/:doctorName',component:ScheduleTableComponent}




  ]},

  { path: "doctors", component: DoctorsComponent,canActivate:[AuthGuard] },
  { path: "unauthorized", component: UnauthorizedComponent },
  { path: "register", component: RegisterComponent },
  { path: "register-doc", component: RegisterDoctorComponent },
  { path: "login", component: LoginComponent },
  { path: "verify", component: VerificationComponent },
  { path: "", component: WelcomeComponent },

  { path: '**', component: NotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes),
    CommonModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
