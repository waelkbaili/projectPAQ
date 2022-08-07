import { Injectable } from '@angular/core';

declare let doTranslate;

@Injectable({
  providedIn: 'root'
})
export class DataService {
  navParams: any={};
  url: string;
  urlAPI: string;


  constructor() {
    //this.url='http://192.168.1.3';
    this.urlAPI='http://192.168.1.190/tutoriel/laravel_api';
    //this.urlAPI='http://localhost/tutoriel/laravel_api';
   }

  setParams(body){
    this.navParams=body;
  }


  getParams(){
    return this.navParams;
  }
  doTranslate(selectedText){
    const translatedText=doTranslate(selectedText);
    return translatedText;
  }
}

