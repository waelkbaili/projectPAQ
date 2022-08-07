import { Component, OnInit } from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { Storage } from '@ionic/storage-angular';



@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

img: any;
newdate: string;
id: any;
idRecup: any;
users: any =[];
result: any=[];
currentImage: string;
verif: boolean;
dataStorage: any;
isLoaded=true;
  constructor(public camera: Camera,public apiService: ApiService,public activateroute: ActivatedRoute
    ,public alertCtrl: AlertController,public navCtrl: NavController,public dataService: DataService,
    public screenOrientation: ScreenOrientation,public storage: Storage) {
      this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
     }
  async ionViewWillEnter(){
      this.id=this.activateroute.snapshot.paramMap.get('id');
      await this.storage.create();
      this.storage.get('storage_xxx').then((res)=>{
        if(res==null){}
        else{
          this.dataStorage=res;
          this.idRecup=this.dataStorage.id;
          this.idRecup=this.dataStorage.id;
          console.log(this.idRecup);
          console.log(this.id);
          if(Number(this.id) ===Number(this.idRecup)){
            this.verif=true;
            console.log(this.verif);
          }
          else{
            this.verif=false;
            console.log(this.verif);
          }
        }
      });
      this.apiService.getUserByIdAPI(this.id).subscribe((res: any) => {
        if(res.status === 'succes'){
          console.log(res.status);
            this.users =[];
            this.result=[];
          this.result.push(res.data);
          for(const datas of this.result){
            this.users.push(datas);
          }
          console.log(this.users[0].img);
          this.img=this.dataService.urlAPI+'/'+this.users[0].img;
          this.currentImage=this.users[0].img;
          this.isLoaded=false;
        }
        else {
          this.isLoaded=false;
          console.log(res.status);
        }
      },(error: any) => {
        this.presentAlert('Time Out','load');
         console.log('erroe');});
     }
  async ngOnInit() {
    }

  getCamera(){
  this.camera.getPicture({
  sourceType:this.camera.PictureSourceType.CAMERA,
  destinationType:this.camera.DestinationType.DATA_URL,
  }).then((res)=>{
    this.img='data:image/jpeg;base64,' +res;}).catch(e=>{
    console.log(e);
  });

  }
  getGallery(){
    this.camera.getPicture({
      sourceType:this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType:this.camera.DestinationType.DATA_URL,
      }).then((res)=>{
        this.img='data:image/jpeg;base64,' +res;}).catch(e=>{
        console.log(e);
      });
  }
  save(){
    const dateTime = new Date().toISOString();
    this.newdate=dateTime.replace(':','-');
    this.newdate=this.newdate.replace(':','-');
    this.newdate=this.newdate.replace('.','-');

    //console.log(this.newdate);

  const data={
    file:this.img,
    path:'storage/app/users/'+this.id+'-'+this.newdate+'.png',
    imgtodelete:this.currentImage
  };
  console.log(data);
  this.apiService.updateUserImageAPI(this.id,data).subscribe((res: any) => {
      this.navCtrl.pop();
  },(error: any) => {
    console.log('error',error);
    this.presentAlert(this.dataService.doTranslate('time out'),'save');

  });
  }
  async presentAlert(msg,param) {
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
            if(param==='load'){
              this.ngOnInit();
            }
            if(param==='save'){
              this.save();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  // eslint-disable-next-line @angular-eslint/use-lifecycle-interface
  ngOnDestroy(){
    this.screenOrientation.unlock();
  }
  stat(id){
    this.navCtrl.navigateForward('/statistiques/'+id);
  }

}


