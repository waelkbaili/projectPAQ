import { Component, OnInit } from '@angular/core';
import { AlertController, LoadingController, NavController,MenuController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/api.service';
import { DataService } from 'src/app/services/data/data.service';
import { AdMobFree, AdMobFreeBannerConfig, AdMobFreeInterstitialConfig, AdMobFreeRewardVideoConfig } from '@ionic-native/admob-free/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
  filterTerm: string;
  dataStorage: any;
  name: string;
  email: string;
  gendre: string;
  dateBirth: string;
  password: string;
  id: string;
  country: string;
  address: string;
  rating: number;
  users: any =[];
  limit = 13;
  start =0;
  startApi=1;
  limitApi=0;
  newCountry='';
  newChoice='';
  token: string;
  platname: string;
  search: string;
  isLoaded= true;


  constructor(private storage: Storage, private navCtrl: NavController,private alertCtrl: AlertController,
    public apiService: ApiService,public loadingCtrl: LoadingController,
     public menu: MenuController,public dataService: DataService,public admob: AdMobFree ) { }

  async ngOnInit() {
    this.search=this.dataService.doTranslate('search');
    await this.storage.create();
    this.storage.get('storage_xxx').then((res)=>{
      if(res==null){
        this.navCtrl.navigateRoot('/intro');
      }
      else{
        this.showBanner();
        this.dataStorage=res;
        //console.log(this.dataStorage);
        this.name=this.dataStorage.name;
        this.email=this.dataStorage.email;
        this.gendre=this.dataStorage.gender;
        this.dateBirth=this.dataStorage.date_birth;
        this.password=this.dataStorage.password;
        this.id=this.dataStorage.id;
        this.country=this.dataStorage.country;
        this.address=this.dataStorage.address;
        this.rating=this.dataStorage.rate;
        this.token=this.dataStorage.token;
        console.log(this.token);
        this.start=0;
        this.users=[];
        if(this.getNewCountry() !== ''){
          this.country=this.newCountry;
        }
        this.loadUsers(this.startApi);
      }
    });
  }
  getNewCountry(){
    return this.newCountry;
  }
  change(){
    this.ngOnInit();
  }
  async doRefresh(event){
    this.ngOnInit();
    const loader = await this.loadingCtrl.create({
      message: this.dataService.doTranslate('please wait'),
    });
    await loader.present();
    setTimeout(() => {
      //console.log('Async operation has ended');
      event.target.complete();
    }, 2000);
    loader.dismiss();
  }
  loadData(event) {
    setTimeout(() => {
      //console.log('Done');
      event.target.complete();
      if(this.startApi<this.limitApi){
        this.startApi++;
        this.loadUsers(this.startApi);
      }
    }, 500);
  }
  async loadUsers(startApiParam){
      /*const data = {
        start: this.start,
        limit: this.limit,
        country: this.country
      };*/
      this.apiService.getData_API(this.country,startApiParam).subscribe((res: any) =>
      //this.apiService.getData(data).subscribe((res: any) =>
      {
        if(res.status === 'succes'){
          this.limitApi=res.nbr;
          for(const datas of res.data){
            this.users.push(datas);
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
  async presentAlert() {
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: this.dataService.doTranslate('are you sure?'),
      buttons: [
        {
          text: this.dataService.doTranslate('close'),
          role: 'cancel',
          handler: (blah) => {
            this.menu.close();
          }
        }, {
          text: this.dataService.doTranslate('logout'),
          handler: () => {
            this.apiService.logout_API().subscribe((res: any) => {
              if(res.status==='logout'){
                this.storage.clear();
                this.navCtrl.navigateRoot('/login');
              }
            },(error: any) => {
               console.log('erroe');});
          }
        }
      ]
    });

    await alert.present();
  }
 /* profil(){
    this.navCtrl.navigateForward('/profil');
  }*/
  detailsuser(msg){
    this.navCtrl.navigateForward('/listfood/'+msg);
    this.menu.close();

    //console.log(msg);
  }
  historique(msg){
    this.navCtrl.navigateForward('/historique-commande/'+msg);
    this.menu.close();
  }
  livraison(msg){
    this.navCtrl.navigateForward('/livraisons/'+msg);
    this.menu.close();
  }
  personalData(msg){
    this.navCtrl.navigateForward('/profil/'+msg);
    this.menu.close();
  }
  chatbot(msg){
    this.navCtrl.navigateForward('/chatbot/'+msg);
    this.menu.close();
  }
  stat(msg){
    this.navCtrl.navigateForward('/statistiques/'+msg);
    this.menu.close();
  }
  params(){
    this.navCtrl.navigateForward('/params');
    this.menu.close();
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
            this.loadUsers(this.startApi);
          }
        }
      ]
    });

    await alert.present();
  }
  changeChoice(){}

  showBanner() {
    const bannerConfig: AdMobFreeBannerConfig = {
        //isTesting: true, // Remove in production
        autoShow: true,
        id:'ca-app-pub-3866206687708891/6985227477'
    };
    this.admob.banner.config(bannerConfig);
    this.admob.banner.prepare().then(() => {
        // success
    }).catch(e => console.log(e));
}
}

