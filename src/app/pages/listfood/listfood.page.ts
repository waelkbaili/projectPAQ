import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController, AlertController, LoadingController, NavController,ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-listfood',
  templateUrl: './listfood.page.html',
  styleUrls: ['./listfood.page.scss'],
})
export class ListfoodPage implements OnInit {
  data: any;
  foods: any =[];
  upFood: any =[];
  panier: any[];
  dataStorage: any;
  useridverif: string;
  idStored: string;
  verif =false;
  verifPlatNumber: any;
  start: number;
  limit: number;
  findIndexFood: number;
  max: number;
  verifMax: boolean;
  pageNumber: number;
  nbrPages: number;
  isLoaded=true;
  constructor(public activateroute: ActivatedRoute,public apiService: ApiService,public storage: Storage,
    public actionSheetController: ActionSheetController,public navctrl: NavController,public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,public toastController: ToastController,public dataService: DataService) { }


  async ionViewWillEnter(){
    this.pageNumber=1;
    this.verifMax=false;
    this.max=0;
    this.start =0;
    this.limit=10;
    this.panier=[];
    const loader = await this.loadingCtrl.create({
      message: this.dataService.doTranslate('please wait'),
    });
    await loader.present();
    setTimeout(() => {
    }, 2000);
    loader.dismiss();
    this.data=this.activateroute.snapshot.paramMap.get('id');
    await this.storage.create();
    this.storage.get('storage_xxx').then((res)=>{
      if(res==null){
      }
      else{
        this.dataStorage=res;
        this.idStored=this.dataStorage.id;
        if(Number(this.dataStorage.id)===Number(this.data)){
          this.verif=true;
        }
      }
    });
    this.storage.get(this.data).then((resx)=>{
      if(resx==null){
      }
      else{
          for(const datas of resx){
            this.panier.push(datas);
          }
        }
    });
    this.foods=[];
    this.loadFood(this.pageNumber);
  }
  async ngOnInit() {}
  loadFood(pageNumber){
    /*const datasend ={
      userId:this.data,
      start: this.start,
      limit: this.limit
    };*/
    this.apiService.getListFoodAPI(this.data,pageNumber).subscribe((res: any) => {
      if(res.status === 'succes'){
        this.nbrPages=res.nbr;
        console.log(this.nbrPages);
        //this.foods=[];
        for(const datas of res.data){
          //console.log(datas.img);
          datas.img=this.dataService.urlAPI+'/'+datas.image;
          //console.log(datas);
          this.foods.push(datas);
          //this.max=datas.max;
        }
       if(this.nbrPages>1){
         //this.verifMax=true;
       }
       this.isLoaded=false;
      }
      else{
        this.isLoaded=false;
      }
    },(error: any) => {
      this.presentAlert(this.dataService.doTranslate('time out'),'load',null);
      console.log('erroe');});
  }
  async options(msg,link) {
    if(this.verif){
      const actionSheet = await this.actionSheetController.create({
        cssClass: 'my-custom-class',
        buttons: [{
          text: this.dataService.doTranslate('delete'),
          role: 'destructive',
          icon: 'trash',
          handler: () => {
            this.deleteFood(msg);
          }
        }, {
          text: this.dataService.doTranslate('update'),
          icon: 'pencil',
          handler: () => {
            this.updateFood(msg);
          }
        },
        {
          text: this.dataService.doTranslate('comment'),
          icon: 'chatbox-ellipses',
          handler: () => {
            this.dataService.setParams({param: msg+'/A'});
            this.navctrl.navigateForward('/commentaire');
            //console.log('Delete clicked');
          }
        },
          {
          text: this.dataService.doTranslate('close'),
          icon: 'close',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();

      const { role } = await actionSheet.onDidDismiss();
      //console.log('onDidDismiss resolved with role', role);
    }
    else{
      const actionSheet = await this.actionSheetController.create({
        cssClass: 'my-custom-class',
        buttons: [{
          text: this.dataService.doTranslate('add to basket'),
          icon: 'add',
          handler: () => {
            //console.log('Delete clicked');
            this.addPanier(msg);
          }
        },{
          text: this.dataService.doTranslate('comment'),
          icon: 'chatbox-ellipses',
          handler: () => {
            this.dataService.setParams({param: msg+'/N'});
            this.navctrl.navigateForward('/commentaire');
            //console.log('Delete clicked');
          }
        },{
          text: this.dataService.doTranslate('watch'),
          icon: 'play-circle-outline',
          handler: () => {
            if(link!==null){
              (window as any).open(link, '_blank');
            }
            else{
              this.presentToast(this.dataService.doTranslate('nothing to show'));
            }
            //console.log('Delete clicked');
          }
        },
          {
          text: this.dataService.doTranslate('close'),
          icon: 'close',
          role: 'cancel',
          handler: () => {
            //console.log('Cancel clicked');
          }
        }]
      });
      await actionSheet.present();

      const { role } = await actionSheet.onDidDismiss();
      //console.log('onDidDismiss resolved with role', role);
    }
  }
  addPanier(msg) {

     this.verifPlatNumber = this.foods.find( food => food.id === msg);

    if(Number(this.verifPlatNumber.plat_number) !== 0.00){
      console.log(this.verifPlatNumber.plat_number);
      const verifExistanceInPanier = this.panier.find( verif => verif.idFood === msg);
     //console.log(verifExistanceInPanier);
     if(verifExistanceInPanier == null){
          this.presentAlertNbrPlat(this.verifPlatNumber.plat_number,msg);
     }
     else{
       this.presentToast(this.dataService.doTranslate('plate exists in the basket'));
     }
    }
    else{
      this.presentToast(this.dataService.doTranslate('plate unavailable'));
    }
  }
  addPlat(){
  this.navctrl.navigateForward('/add-food/'+this.idStored);
  }
  async presentAlert(msg,param,id) {
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
              this.loadFood(this.pageNumber);
            }
            if(param==='delete'){
              this.deleteFood(id);
            }
            if(param==='update'){
              this.updateFood(id);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  deleteFood(msg){
    this.apiService.deletePlatAPI(msg).subscribe((res: any) =>{
      if(res.status === 'succes'){
        console.log(res.status);
       //this.loadFood();
       //console.log(this.foods);
       this.findIndexFood = this.foods.findIndex( food => food.id === msg);
       this.foods.splice(this.findIndexFood,1);
      }
      else {
        console.log(this.dataService.doTranslate('something wrong'));
      }
    },(error: any) => {
      this.presentAlert(this.dataService.doTranslate('time out'),'delete',msg);
      console.log('erroe');
     });
  }
  updateFood(msg){
    this.apiService.getFoodByIdAPI(msg).subscribe((res: any) => {
      if(res.status === 'succes'){
        console.log(res.status);
        console.log(res.data);
        this.storage.create();
        this.storage.set('update_data',res.data);
        this.navctrl.navigateForward('/add-food/'+this.idStored);
      }
      else {
        console.log(this.dataService.doTranslate('something wrong'));
      }
    },(error: any) => {
      this.presentAlert(this.dataService.doTranslate('time out'),'update',msg);
      console.log('erroe');});
  }
  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }
  passerCommande(){
    this.navctrl.navigateForward('/passer-commande/'+this.data+'/'+this.idStored);
  }
  async presentAlertNbrPlat(nbrmax,msg){
    const alert = await this.alertCtrl.create({
      cssClass: 'my-custom-class',
      header: 'enter plat number (max '+nbrmax+')',
      inputs: [
        {
          name: 'name6',
          type: 'number',
          value:1,
          max:Number(nbrmax),
          min:-1
        }],
        buttons: [
          {
            text: this.dataService.doTranslate('close'),
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
              console.log('Confirm Cancel');
            }
          }, {
            text: 'Ok',
            handler: dataaa => {
              //console.log(dataaa.name6);
              //console.log(nbrmax);

              if(Number(dataaa.name6)>Number(nbrmax)){
                //console.log('why are you here');
                this.presentToast('nbr max '+nbrmax);
                this.presentAlertNbrPlat(nbrmax,msg);
              }
              else{
                this.panier.push({
                  idFood:msg,
                  name:this.verifPlatNumber.name,
                  platNumber:dataaa.name6,
                  //price:this.verifPlatNumber.price,
                  pricetot:this.verifPlatNumber.price*dataaa.name6,
                  priceUnt:this.verifPlatNumber.price,
                  idCuistot:this.data,
                  iduser:this.idStored,
                  platNbrMax:nbrmax
                });
                this.storage.create();
                this.storage.set(this.data,this.panier);
                //console.log(this.panier);
              }
            }
          }
        ]
      });
      await alert.present();
  }
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      if(this.pageNumber<this.nbrPages){
        this.pageNumber++;
        this.loadFood(this.pageNumber);
        event.target.complete();
      }
    }, 2000);
    if (Number(this.pageNumber) === Number(this.nbrPages)) {
      //this.conversation.reverse();
      event.target.disabled = true;
    }
  }

  profil(){
    this.navctrl.navigateForward('/profil/'+this.data);
  }
}
