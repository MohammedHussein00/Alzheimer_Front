import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-admin',
  templateUrl: './sidebar-admin.component.html',
  styleUrls: ['./sidebar-admin.component.css']
})
export class SidebarAdminComponent implements OnInit {


  constructor() { }

  ngOnInit() {

  }


  rotateSVG() {
    const svgElement2 = document.querySelector('.svg2');
    const svgElement1 = document.querySelector('.svg1');
    svgElement1!.classList.toggle('rotate');
    svgElement2!.classList.toggle('rotate');
  }

}
