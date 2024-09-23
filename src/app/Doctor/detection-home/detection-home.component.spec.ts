import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetectionHomeComponent } from './detection-home.component';

describe('DetectionHomeComponent', () => {
  let component: DetectionHomeComponent;
  let fixture: ComponentFixture<DetectionHomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DetectionHomeComponent]
    });
    fixture = TestBed.createComponent(DetectionHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
