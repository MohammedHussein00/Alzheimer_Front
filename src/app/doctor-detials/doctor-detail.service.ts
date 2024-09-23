import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DoctorDetailService {

  constructor() { }
  convertToTimeFormat(timeString: string): string {
    const [hours, minutes] = timeString.split(':');
    const hoursInt = parseInt(hours, 10);
    const amPm = hoursInt >= 12 ? 'PM' : 'AM';
    const displayHours = hoursInt % 12 || 12;
    return `${displayHours}:${minutes} ${amPm}`;
  }
}
