// import { TestBed, ComponentFixture } from '@angular/core/testing';
// import { RouterTestingModule } from '@angular/router/testing';
// import { AppComponent } from './app.component';

// describe('AppComponent', () => {
//   let fixture: ComponentFixture<AppComponent>;
//   let component: AppComponent;

//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       imports: [RouterTestingModule],
//       declarations: [AppComponent]
//     }).compileComponents();
//   });

//   beforeEach(() => {
//     fixture = TestBed.createComponent(AppComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create the app component', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should have isVisible initially set to false', () => {
//     expect(component.isVisible).toBeFalse();
//   });

//   it('should open the modal when openModal() is called', () => {
//     component.openModal();
//     expect(component.isVisible).toBeTrue();
//   });

//   it('should close the modal when closeModal() is called', () => {
//     component.isVisible = true;
//     const eventMock = new MouseEvent('click');
//     component.closeModal(eventMock);
//     expect(component.isVisible).toBeFalse();
//   });

//   it('should not close the modal if event target is not modal container', () => {
//     component.isVisible = true;
//     const eventMock = new MouseEvent('click', { target: fixture.nativeElement.querySelector('.modal-content') });
//     component.closeModal(eventMock);
//     expect(component.isVisible).toBeTrue();
//   });

//   it('should stop event propagation when stopPropagation() is called', () => {
//     const eventMock = new MouseEvent('click');
//     spyOn(eventMock, 'stopPropagation');
//     component.stopPropagation(eventMock);
//     expect(eventMock.stopPropagation).toHaveBeenCalled();
//   });

//   it('should render the modal when isVisible is true', () => {
//     component.isVisible = true;
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('.modal')?.classList.contains('show')).toBeTrue();
//   });

//   it('should not render the modal when isVisible is false', () => {
//     component.isVisible = false;
//     fixture.detectChanges();
//     const compiled = fixture.nativeElement as HTMLElement;
//     expect(compiled.querySelector('.modal')?.classList.contains('show')).toBeFalse();
//   });
// });
