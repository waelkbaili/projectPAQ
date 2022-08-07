import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';


@Component({
  selector: 'app-params',
  templateUrl: './params.page.html',
  styleUrls: ['./params.page.scss'],
})
export class ParamsPage implements OnInit {

  choix: string;

  constructor(public dataService: DataService) { }

  ngOnInit() {
    const val=localStorage.getItem('language');
    if(val===null){
      this.choix='en';
    }
    else{
      this.choix=val;
    }
  }

  valueChanged(){
    localStorage.setItem('language',this.choix);
  }

}
