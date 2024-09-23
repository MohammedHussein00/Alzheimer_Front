import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { FooterComponent } from './footer/footer.component';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SidebarAdminComponent } from './Admin/sidebar/sidebar-admin.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DashboardComponent } from './Admin/dashboard/dashboard.component';
import { RegisterComponent } from './Patients/register/register.component';
import { AdminLayoutComponent } from './Admin/admin-layout/admin-layout.component';
import { LoginComponent } from './Patients/register/login/login.component';
import { RegisterDoctorComponent } from './Doctor/register-doctor/register-doctor.component';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './header/header.component';
import { DoctorsComponent } from './doctors/doctors.component';
import { PageVisitTrackerService } from './Service/page-visit-tracker.service';
import { DoctorDetialsComponent } from './doctor-detials/doctor-detials.component';
import { DetectionComponent } from './detection/detection.component';
import { DoctorHomeComponent } from './Doctor/doctor-home/doctor-home.component';
import { DoctorHeaderComponent } from './Doctor/doctor-header/doctor-header.component';
import { DoctorSidebarComponent } from './Doctor/doctor-sidebar/doctor-sidebar.component';
import { ScheduleComponent } from './Doctor/Schedule/schedule.component';
import { NoScheduleComponent } from './Doctor/no-schedule/no-schedule.component';
import { ScheduleTableComponent } from './Doctor/schedule-table/schedule-table.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { DetectionResultComponent } from './Doctor/detection-result/detection-result.component';
import { SelectListComponent } from './select-list/select-list.component';
import { DoctorProfileComponent } from './Doctor/doctor-profile/doctor-profile.component';
import { ClinicComponent } from './Doctor/clinic/clinic.component';
import { NotificationComponent } from './notification/notification.component';
import {SkeletonLoaderModule} from './loader/skeleton-loader.module'
import { AuthGuard } from './Service/auth.guard';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { InterCeptorInterceptor } from './Service/inter-ceptor.interceptor';
import { VerificationComponent } from './verification/verification.component';
import { AppointmentComponent } from './Patients/appointment/appointment.component';
import { DetectionHomeComponent } from './Doctor/detection-home/detection-home.component';
import { DashDoctorsComponent } from './Admin/dash-doctors/dash-doctors.component';
import { DashDoctorDetialsComponent } from './Admin/dash-doctor-detials/dash-doctor-detials.component';
import { PatientDetectionComponent } from './Admin/patient-detection/patient-detection.component';
import { HomeDetectionPatientComponent } from './Admin/home-detection-patient/home-detection-patient.component';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    AdminLayoutComponent,
    SidebarComponent,
    DashboardComponent,
    RegisterComponent,
    LoginComponent,
    RegisterDoctorComponent,
    WelcomeComponent,
    HeaderComponent,
    SidebarAdminComponent,
    DoctorsComponent,
    DoctorDetialsComponent,
    DetectionComponent,
    DoctorHomeComponent,
    DoctorHeaderComponent,
    DoctorSidebarComponent,
    ScheduleComponent,
    NoScheduleComponent,
    ScheduleTableComponent,
    UserProfileComponent,
    DetectionResultComponent,
    SelectListComponent,
    DoctorProfileComponent,
    ClinicComponent,
    NotificationComponent,
    UnauthorizedComponent,
    NotFoundComponent,
    VerificationComponent,
    AppointmentComponent,
    DetectionHomeComponent,
    DashDoctorsComponent,
    DashDoctorDetialsComponent,
    PatientDetectionComponent,
    HomeDetectionPatientComponent,
    MessageComponent
    ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    SkeletonLoaderModule

  ],
  providers: [PageVisitTrackerService,
    {provide:HTTP_INTERCEPTORS,useClass:InterCeptorInterceptor,
      multi:true},
    AuthGuard
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
