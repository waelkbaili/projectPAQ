import { Component, OnInit } from '@angular/core';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController, ToastController } from '@ionic/angular';
import { ApiService } from 'src/app/api.service';
import { Storage } from '@ionic/storage-angular';
import { Camera } from '@ionic-native/camera/ngx';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-add-food',
  templateUrl: './add-food.page.html',
  styleUrls: ['./add-food.page.scss'],
})
export class AddFoodPage implements OnInit {
  public addPlatForm: FormGroup;
  public isValid: boolean;
  idRecap: any;
  isUpdate: boolean;
  foodname: string;
  fooddescription: string;
  foodprice: string;
  foodplatnumber: string;
  foodtype: string;
  foodid: string;
  dataStorage: any;
  img: any;
  newdate: string;
  previousimage: string;
  link: string;
  placeholder: string;

  constructor(
    public toastController: ToastController,public activateroute: ActivatedRoute,
    public loadingCtrl: LoadingController,public alertCtrl: AlertController,
    public apiService: ApiService,public navCtrl: NavController,public camera: Camera,
    public formBuilder: FormBuilder,private router: Router,public storage: Storage,public dataService: DataService) {
      this.idRecap=activateroute.snapshot.paramMap.get('id');
      this.isValid=true;
      this.addPlatForm = this.formBuilder.group({
        // eslint-disable-next-line @typescript-eslint/naming-convention
        plat_name: ['', Validators.required],
        description: ['', Validators.required],
        price: ['', Validators.required],
        // eslint-disable-next-line @typescript-eslint/naming-convention
        plat_number: ['', Validators.required],
        type: ['', Validators.required],
        link: []
      });
     }

  async ngOnInit() {
    this.placeholder=this.dataService.doTranslate('insert the video link of the dish preparation');
    this.img='assets/icon/unknown-food.jpg';
    await this.storage.create();
    this.storage.get('update_data').then((res)=>{
      if(res==null){
        this.isUpdate=false;
      }
      else{
        this.dataStorage=res;
        this.isUpdate=true;
        this.foodid=this.dataStorage.id;
        this.addPlatForm = this.formBuilder.group({
          // eslint-disable-next-line @typescript-eslint/naming-convention
          plat_name: [this.dataStorage.name, Validators.required],
          description: [this.dataStorage.description, Validators.required],
          price: [this.dataStorage.price, Validators.required],
          // eslint-disable-next-line @typescript-eslint/naming-convention
          plat_number: [this.dataStorage.plat_number, Validators.required],
          type: [this.dataStorage.type, Validators.required],
        });
        this.img=this.dataService.urlAPI+'/'+this.dataStorage.image;
        this.previousimage=this.dataStorage.image;
      }
    });
  }
  async addPlat(){
    if(! this.addPlatForm.valid){
      this.isValid=false;
    }
    else{
      this.isValid=true;
      const loader = await this.loadingCtrl.create({
        message: this.dataService.doTranslate('please wait'),
      });
      await loader.present();
      const dateTime = new Date().toISOString();
      this.newdate=dateTime.replace(':','-');
      this.newdate=this.newdate.replace(':','-');
      this.newdate=this.newdate.replace('.','-');
      const data = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        name:this.addPlatForm.value.plat_name,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        description:this.addPlatForm.value.description,
        price:this.addPlatForm.value.price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        plat_number:this.addPlatForm.value.plat_number,
        type:this.addPlatForm.value.type,
        link:this.addPlatForm.value.link,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_id:this.idRecap,
        file:this.img,
        path:'storage/app/foods/'+this.idRecap+'-'+this.newdate+'.png'
      };

      console.log(data);
      this.apiService.addPlatAPI(data).subscribe((res: any) => {
        console.log(res);
        if(res.status === 'succes'){
          loader.dismiss();
          //this.presentToast(res.status);
          //this.navCtrl.navigateBack('/listfood/'+this.idRecap);
          this.navCtrl.pop();
        }
        else {
        loader.dismiss();
        this.presentToast(this.dataService.doTranslate('something wrong'));
        }
      },(error: any) => {
        console.log('error',error);
        loader.dismiss();
        this.presentAlert(this.dataService.doTranslate('time out'),'add');
      });
    }

    }
  get errorCtr() {
    return this.addPlatForm.controls;
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
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
            if(param==='add'){
              this.addPlat();
            }
            if(param==='update'){
              this.updatePlat();
            }
          }
        }
      ]
    });

    await alert.present();
  }
  async updatePlat(){
    if(! this.addPlatForm.valid){
      this.isValid=false;
    }
    else{
      this.isValid=true;
      const loader = await this.loadingCtrl.create({
        message: this.dataService.doTranslate('please wait'),
      });
      await loader.present();
      const dateTime = new Date().toISOString();
      this.newdate=dateTime.replace(':','-');
      this.newdate=this.newdate.replace(':','-');
      this.newdate=this.newdate.replace('.','-');
      const data = {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        name:this.addPlatForm.value.plat_name,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        description:this.addPlatForm.value.description,
        price:this.addPlatForm.value.price,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        plat_number:this.addPlatForm.value.plat_number,
        type:this.addPlatForm.value.type,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_id:this.idRecap,
        file:this.img,
        path:'storage/app/foods/'+this.idRecap+'-'+this.newdate+'.png',
        imgtodelete:this.previousimage
      };

      this.apiService.updatePlatAPI(this.foodid,data).subscribe((res: any) => {
        if(res.status === 'succes'){
          loader.dismiss();
          //this.presentToast(res.status);
          this.storage.create();
          this.storage.set('update_data',null);
          //this.navCtrl.navigateBack('/listfood/'+this.idRecap);
          this.navCtrl.pop();
        }
        else {
        loader.dismiss();
        this.presentToast(this.dataService.doTranslate('something wrong'));
        }
      },(error: any) => {
        console.log('error',error);
        loader.dismiss();
        this.presentAlert(this.dataService.doTranslate('time out'),'update');
      });
    }
  }
  cleardata(){
    this.storage.create();
    this.storage.set('update_data',null);
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

}
