import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashDoctorsComponent } from './dash-doctors.component';

describe('DashDoctorsComponent', () => {
  let component: DashDoctorsComponent;
  let fixture: ComponentFixture<DashDoctorsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DashDoctorsComponent]
    });
    fixture = TestBed.createComponent(DashDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
