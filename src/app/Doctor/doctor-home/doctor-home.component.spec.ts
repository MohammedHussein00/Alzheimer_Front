import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorHomeComponent } from './doctor-home.component';

describe('HomeComponent', () => {
  let component: DoctorHomeComponent;
  let fixture: ComponentFixture<DoctorHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DoctorHomeComponent]
    });
    fixture = TestBed.createComponent(DoctorHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
