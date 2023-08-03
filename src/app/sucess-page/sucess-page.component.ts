import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sucess-page',
  templateUrl: './sucess-page.component.html',
  styleUrls: ['./sucess-page.component.css']
})
export class SucessPageComponent {

  constructor(private router:Router){}

  back(){
    localStorage.clear();
    this.router.navigate(['/']);
  }

}
