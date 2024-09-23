import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

@Component({
    selector: 'app-notification',
    templateUrl: './notification.component.html',
    styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
    @Input() title: string = 'New notification';
    @Input() avatarUrl: string = '';
    @Input() user1: string = 'User1';
    @Input() user2: string = 'User2';
    @Input() others: number = 0;
    @Input() community: string = 'Community';
    showNotification: boolean = false;

    constructor(private renderer: Renderer2, private el: ElementRef) {}

    ngOnInit(): void {
        // Set flag to true to show the notification when the component is initialized

        // Add a class to the notification element to trigger the animation on load
        this.renderer.addClass(this.el.nativeElement.querySelector('.notification'), 'show');

        // Start a timer to make the notification disappear after 15 seconds
        setTimeout(() => {
        this.showNotification = true;

        }, 1000); // 15 seconds

        setTimeout(() => {
            this.closeNotification();
        }, 10000); // 15 seconds
    }

    closeNotification(): void {
        // Logic to close or remove the notification
        this.showNotification = false;
    }
}
