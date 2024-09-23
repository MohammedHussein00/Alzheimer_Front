import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionComponent } from './detection.component';

describe('FooterComponent', () => {
  let component: DetectionComponent;
  let fixture: ComponentFixture<DetectionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetectionComponent]
    });
    fixture = TestBed.createComponent(DetectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
