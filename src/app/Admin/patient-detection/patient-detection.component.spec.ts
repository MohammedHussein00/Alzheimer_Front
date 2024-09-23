import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientDetectionComponent } from './patient-detection.component';

describe('PatientDetectionComponent', () => {
  let component: PatientDetectionComponent;
  let fixture: ComponentFixture<PatientDetectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDetectionComponent]
    });
    fixture = TestBed.createComponent(PatientDetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
