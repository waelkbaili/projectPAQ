import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute} from '@angular/router';
import { AlertController} from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { DataService } from 'src/app/services/data/data.service';
import Chart from 'chart.js/auto';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';


@Component({
  selector: 'app-statistiques',
  templateUrl: './statistiques.page.html',
  styleUrls: ['./statistiques.page.scss'],
})
export class StatistiquesPage {
  @ViewChild('barCanvas') private barCanvas: ElementRef;
  barChart: any;
  selector: string;
  selectorWeek: string;
  newSelector: string;
  newWeek: string;
  idUser: any;
  xData: any=[];
  yData: any=[];
  newXData: any=[];
  newYData: any=[];
  verif: boolean;
  week: boolean;
  mounthHolder: string;
  weekHolder: string;
  isLoaded=true;


  constructor(public apiService: ApiService,public activateroute: ActivatedRoute,
    private alertCtrl: AlertController,public dataService: DataService,public admob: AdMobFree) {
    this.selector='mounth';
    this.verif=false;
    this.week=false;
    this.xData=[];
    this.yData=[];
  }

  ionViewWillEnter(){
    this.launchVideo();
    this.mounthHolder=this.dataService.doTranslate('mounth');
    this.weekHolder=this.dataService.doTranslate('week');
    this.idUser=this.activateroute.snapshot.paramMap.get('iduser');
    const data={
      cle:this.selector,
      // eslint-disable-next-line @typescript-eslint/naming-convention
      cuistot_id:this.idUser
    };
    this.apiService.getStatAPI(data).subscribe((res: any) =>
      {
        console.log(res);
        if(res.status === 'succes'){
          this.xData=res.somme;
          this.yData=res.details;
          if(this.week){
            this.barChartMethod(this.xData,this.yData,this.newWeek);
          }
          else{
            this.barChartMethod(this.xData,this.yData,null);
          }
          this.isLoaded=false;
        }
        else {
          this.isLoaded=false;
          console.log(res.status);
        }
      },(error: any) => {
        this.presentAlertPlus(this.dataService.doTranslate('time out'));
        console.log('erroe');});
  }

  barChartMethod(xData,yData,week) {
    if (this.barChart) {
      this.barChart.destroy();
    }
    if(week===null){
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          // eslint-disable-next-line max-len
          labels: yData,
          datasets: [{
            label: 'Statistiques',
            // eslint-disable-next-line max-len
            data: xData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    }
    else{
      const start=week*4-3-1;
      const end=week*4-1;
      this.newXData=[];
      this.newYData=[];
      for(let i=start; i<=end;i++){
        this.newXData.push(xData[i]);
        this.newYData.push(yData[i]);
      }
      this.barChart = new Chart(this.barCanvas.nativeElement, {
        type: 'bar',
        data: {
          // eslint-disable-next-line max-len
          labels: this.newYData,
          datasets: [{
            label: 'Statistiques',
            // eslint-disable-next-line max-len
            data: this.newXData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
              'rgba(255,99,132,1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }]
        }
      });
    }

  }
  change(){
    this.selector=this.newSelector;
    if(this.newSelector==='mounth'){
      this.verif=false;
      this.week=false;
    }
    else{
      this.verif=true;
      this.week=true;
      this.newWeek='1';
    }
    this.ionViewWillEnter();
  }
  async presentAlertPlus(msg) {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: msg,
      buttons: [
        {
          text: this.dataService.doTranslate('close'),
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
          }
        }, {
          text: this.dataService.doTranslate('try again'),
          handler: () => {
            //this.tryLogin();
            this.ionViewWillEnter();
          }
        }
      ]
    });

    await alert.present();
  }

  changeWeek(){
    this.selectorWeek=this.newWeek;
    this.barChartMethod(this.xData,this.yData,this.newWeek);
  }

  launchVideo() {
    const interstitialConfig: AdMobFreeRewardVideoConfig = {
        isTesting: true, // Remove in production
        autoShow: true
        //id: Your Ad Unit ID goes here
    };
    this.admob.rewardVideo.config(interstitialConfig);
    this.admob.rewardVideo.prepare().then(() => {
        // success
    });
  }

}
