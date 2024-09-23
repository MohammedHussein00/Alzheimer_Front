import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoScheduleComponent } from './no-schedule.component';

describe('NoScheduleComponent', () => {
  let component: NoScheduleComponent;
  let fixture: ComponentFixture<NoScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NoScheduleComponent]
    });
    fixture = TestBed.createComponent(NoScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
