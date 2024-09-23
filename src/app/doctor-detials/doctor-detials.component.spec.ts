import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorDetialsComponent } from './doctor-detials.component';

describe('DoctorDetialsComponent', () => {
  let component: DoctorDetialsComponent;
  let fixture: ComponentFixture<DoctorDetialsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorDetialsComponent]
    });
    fixture = TestBed.createComponent(DoctorDetialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
