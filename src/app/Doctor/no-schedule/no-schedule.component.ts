import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-no-schedule',
  templateUrl: './no-schedule.component.html',
  styleUrls: ['./no-schedule.component.css']
})
export class NoScheduleComponent {

  doctorName:string|undefined

  constructor(private http:HttpClient) { }

  ngOnInit(): void {
  }
}
