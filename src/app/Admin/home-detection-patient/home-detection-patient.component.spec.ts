import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeDetectionPatientComponent } from './home-detection-patient.component';

describe('HomeDetectionPatientComponent', () => {
  let component: HomeDetectionPatientComponent;
  let fixture: ComponentFixture<HomeDetectionPatientComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HomeDetectionPatientComponent]
    });
    fixture = TestBed.createComponent(HomeDetectionPatientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
