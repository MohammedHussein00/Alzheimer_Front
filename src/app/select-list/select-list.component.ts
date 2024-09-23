import { Component,Renderer2, ElementRef, EventEmitter, HostListener, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { ReceivedData } from './received-data';
import { Mode } from './Mode';

@Component({
  selector: 'app-select-list',
  templateUrl: './select-list.component.html',
  styleUrls: ['./select-list.component.css']
})
export class SelectListComponent implements OnInit,OnChanges {
  open:boolean=false;
  opened:boolean=false;
  active:number=-1;
  selectedElement:string='';
  @ViewChild('element1') element1: ElementRef | undefined;
  @ViewChild('input') input: ElementRef | undefined;
  @ViewChild('parent') parent: ElementRef | undefined;
  @Input() receivedData:ReceivedData[]=[];
  @Input() Mode!:Mode;
  @Input() mode:boolean=false;
  @Output() sendData:EventEmitter<number>;
  inputValue: string = '';
  moreLength: boolean = true;
  filteredData:ReceivedData[]=[];
  constructor(private renderer: Renderer2) {
    this.sendData=new EventEmitter<number>();
   }
  ngOnChanges(changes: SimpleChanges): void {
    this.filteredData=this.receivedData;
    if(this.filteredData.length<15)
    this.moreLength=false
    if(!this.mode)
      {
        document.documentElement.style.setProperty('--defaultBG',this.Mode.defaultBG.light );
        document.documentElement.style.setProperty('--defaultBorder',this.Mode.defaultBorder.light );
        document.documentElement.style.setProperty('--defaultBGHover',this.Mode.defaultBGHover.light );
        document.documentElement.style.setProperty('--defaultBorderHover',this.Mode.defaultBorderHover.light );
        document.documentElement.style.setProperty('--iconColor',this.Mode.iconColor.light );
        document.documentElement.style.setProperty('--iconHoverColor',this.Mode.iconHoverColor.light );
        document.documentElement.style.setProperty('--OptionBG',this.Mode.OptionBG.light );
        document.documentElement.style.setProperty('--OptionLiHover',this.Mode.OptionLiHover.light );
        document.documentElement.style.setProperty('--OptionLiActive',this.Mode.OptionLiActive.light );
        document.documentElement.style.setProperty('--OptionColorLiActive',this.Mode.OptionColorLiActive.light );
        document.documentElement.style.setProperty('--colorLabel',this.Mode.colorLabel.light );
      }
      else{
        document.documentElement.style.setProperty('--defaultBG',this.Mode.defaultBG.night );
        document.documentElement.style.setProperty('--defaultBorder',this.Mode.defaultBorder.night );
        document.documentElement.style.setProperty('--defaultBGHover',this.Mode.defaultBGHover.night );
        document.documentElement.style.setProperty('--defaultBorderHover',this.Mode.defaultBorderHover.night );
        document.documentElement.style.setProperty('--iconColor',this.Mode.iconColor.night );
        document.documentElement.style.setProperty('--iconHoverColor',this.Mode.iconHoverColor.night );
        document.documentElement.style.setProperty('--OptionBG',this.Mode.OptionBG.night );
        document.documentElement.style.setProperty('--OptionLiHover',this.Mode.OptionLiHover.night );
        document.documentElement.style.setProperty('--OptionLiActive',this.Mode.OptionLiActive.night );
        document.documentElement.style.setProperty('--OptionColorLiActive',this.Mode.OptionColorLiActive.night );
        document.documentElement.style.setProperty('--colorLabel',this.Mode.colorLabel.night );
      }

  }
  compareInput() {
    const inputValueLowerCase = this.inputValue.toLowerCase(); // Convert to lowercase for case-insensitive comparison

    // Use filter to get an array of matching items
    this.filteredData = this.receivedData.filter(obj => obj.name.toLowerCase().includes(inputValueLowerCase));

    if (!inputValueLowerCase) {
      this.filteredData=this.receivedData;
    }

  }
  ngOnInit(): void {
  }





  selected(x: ReceivedData) {
    this.sendData.emit(x.id);
    this.active = x.id;
    this.selectedElement = x.name;
  }


  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.element1?.nativeElement === event.target) {
      this.open = !this.open;
    } else if (this.input?.nativeElement !== event.target && this.parent?.nativeElement !== event.target) {
      if(this.open)
      this.opened=true;

      this.open = false;

    }

    setTimeout(() => {
      this.repositionDropdown();
    }, 100); // 100 milliseconds delay
  }

        repositionDropdown() {
          const dropdown = document.querySelector('.option');
          if (dropdown) {
            const dropdownRect = dropdown.getBoundingClientRect().bottom;
            const dropdownBottom = window.innerHeight - dropdownRect;
            if (dropdownBottom < 3) {
              dropdown.classList.add('above');
            } else {
              dropdown.classList.remove('above');
            }
          }
        }

        @HostListener('window:resize')
onWindowResize() {
  const dropdown = document.querySelector('.bi-caret-down-fill');
  if (dropdown!.classList.contains('iconSelect')) {
    this.repositionDropdown();
  }
}
}
