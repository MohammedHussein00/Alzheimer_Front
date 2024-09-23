import { Component } from '@angular/core';
import { LoaderService } from './Service/loader.service';

// Decorator
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  isVisible = false;
constructor(public loader:LoaderService){

}

  openModal(): void {
    this.isVisible = true;
  }

  closeModal(event: MouseEvent): void {
    // Check if the event target is the modal container itself, not its children
    if (event.target === event.currentTarget) {
      this.isVisible = false;
    }
  }

  stopPropagation(event: MouseEvent): void {
    // Prevent the event from bubbling up to the parent element
    event.stopPropagation();
  }
}
