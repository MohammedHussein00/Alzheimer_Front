import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDoctorDetialsComponent } from './dash-doctor-detials.component';

describe('DashDoctorDetialsComponent', () => {
  let component: DashDoctorDetialsComponent;
  let fixture: ComponentFixture<DashDoctorDetialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashDoctorDetialsComponent]
    });
    fixture = TestBed.createComponent(DashDoctorDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
