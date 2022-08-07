import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { AlertController } from '@ionic/angular';
import { Camera } from '@ionic-native/camera/ngx';
import { Storage } from '@ionic/storage-angular';
import { DataService } from 'src/app/services/data/data.service';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';



@Component({
  selector: 'app-intro',
  templateUrl: './intro.page.html',
  styleUrls: ['./intro.page.scss'],
})
export class IntroPage implements OnInit {
  img: any;
  dataStorage: any;

  constructor(public navCtrl: NavController,public alertCtrl: AlertController
    ,public dataService: DataService,public admob: AdMobFree) {


   }

  async ngOnInit() {
    const val=localStorage.getItem('language');
    if(val===null){
      this.openAlert();
    }
  }
  login(){
    this.navCtrl.navigateForward(['/login']);
  }

  async openAlert(){
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'language translation',
        inputs:[{
          type:'radio',
          label:'english',
          value:'en'
        },
        {
          type:'radio',
          label:'french',
          value:'fr'
        },
        {
          type:'radio',
          label:'arabic',
          value:'ar'
        }],
        buttons: [
          {
            text: 'close',
            role: 'cancel',
            cssClass: 'secondary',
            handler: (blah) => {
            }
          }, {
            text: 'ok',
            handler: (data) => {
              console.log(data);
              localStorage.setItem('language',data);
            }
          }
        ]
      });

      await alert.present();

  }

  showBanner() {
    const bannerConfig: AdMobFreeBannerConfig = {
        isTesting: true, // Remove in production
        autoShow: true
        //id: Your Ad Unit ID goes here
    };
    this.admob.banner.config(bannerConfig);
    this.admob.banner.prepare().then(() => {
        // success
    }).catch(e => console.log(e));
}

launchInterstitial() {
  const interstitialConfig: AdMobFreeInterstitialConfig = {
      isTesting: true, // Remove in production
      autoShow: true
      //id: Your Ad Unit ID goes here
  };
  this.admob.interstitial.config(interstitialConfig);
  this.admob.interstitial.prepare().then(() => {
      // success
  });
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
