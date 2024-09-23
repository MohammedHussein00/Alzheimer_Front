import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GlobalVariablesService {
  night:boolean=false;

  constructor() { }
}
