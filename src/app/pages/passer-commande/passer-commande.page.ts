import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController, AlertController, LoadingController, NavController,ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataService } from 'src/app/services/data/data.service';


@Component({
  selector: 'app-passer-commande',
  templateUrl: './passer-commande.page.html',
  styleUrls: ['./passer-commande.page.scss'],
})
export class PasserCommandePage implements OnInit {
  data: any;
  dataStorage: any;
  cmds: any =[];
  findIndexFood: any;
  montant: number;
  verif: boolean;
  client: any;
  notes: string ;
  adrgps: string ;
  listCmd: any=[];
  readonly: boolean;
  choix: string;
  latitude: number;
  longitude: number;

  constructor(public activateroute: ActivatedRoute,public apiService: ApiService,public storage: Storage,
    public actionSheetController: ActionSheetController,public navctrl: NavController,public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,public toastController: ToastController,private geolocation: Geolocation,
    public dataService: DataService) {
     }

  async ngOnInit() {
    this.choix='man';
    this.readonly=true;
    this.notes='';
    this.montant=0;
    this.verif=false;
    this.data=this.activateroute.snapshot.paramMap.get('idcuistot');
    this.client=this.activateroute.snapshot.paramMap.get('idclient');
    await this.storage.create();
      this.storage.get(this.data).then((res)=>{
        if(res==null){
        }
        else{
          this.verif=true;
          this.dataStorage=res;
          for(const datas of this.dataStorage){
            this.cmds.push(datas);
            this.montant+=datas.pricetot;
          }
          if(this.montant===0){
            this.verif=false;
          }
        }
      });
      console.log(this.cmds);
  }
  async deletePlat(idCuistot,idFood){
    await this.storage.create();
      this.storage.get(idCuistot).then((res)=>{
        if(res==null){
        }
        else{
          this.findIndexFood = res.findIndex( food => food.idFood === idFood);
          res.splice(this.findIndexFood,1);
          this.storage.set(idCuistot,res);
          this.cmds=[];
          this.ngOnInit();
         // console.log(res);
        }
      });
  }
  async passerCommande(){
    const loader = await this.loadingCtrl.create({
      message: this.dataService.doTranslate('please wait'),
    });
    for(const cmd of this.cmds){
      this.listCmd.push(cmd.idFood+'@'+cmd.platNumber+'@'+cmd.name+'@'+'?');
      const upd={
        // eslint-disable-next-line @typescript-eslint/naming-convention
        plat_number:cmd.platNbrMax-cmd.platNumber
      };
      //console.log(upd);
      this.apiService.updatePlatNumberAPI(cmd.idFood,upd).subscribe((res: any) => {
        if(res.status === 'succes'){
          console.log(res.status);
        }
        else {
        console.log(res.status);
        }
      },(error: any) => {
        this.presentAlert(this.dataService.doTranslate('time out'));
        console.log('error',error);
        loader.dismiss();
      });
    }
    await loader.present();
    const commande ={
      // eslint-disable-next-line @typescript-eslint/naming-convention
      client_id:Number(this.client),
      // eslint-disable-next-line @typescript-eslint/naming-convention
      cuistot_id:Number(this.data),
      note:this.notes,
      listCmd:this.listCmd,
      address:this.adrgps
    };
    //console.log(commande);
    this.apiService.passercmdAPI(commande).subscribe((res: any) => {
      if(res.status === 'succes'){
        loader.dismiss();
        //console.log(res.status);
        this.cmds=[];
        this.storage.set(this.data,this.cmds);
        this.verif=false;
        //this.presentToast(res.status);
        //this.navCtrl.navigateBack('/listfood/'+this.idRecap);
        //this.navCtrl.pop();
      }
      else {
      loader.dismiss();
      //console.log(res.status);
      //this.presentToast(res.status);
      }
    },(error: any) => {
      this.presentAlert(this.dataService.doTranslate('time out'));
      console.log('error',error);
      loader.dismiss();
      //this.presentAlert('Time Out');
    });
   // console.log(commande);
    this.listCmd=[];
    loader.dismiss();
  }
  async presentAlert(msg) {
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
            this.passerCommande();
          }
        }
      ]
    });

    await alert.present();
  }
  valueChanged(){
    if(this.choix==='auto'){
      this.loadingCtrl.create();
      this.readonly=true;
      this.geolocation.getCurrentPosition().then((resp) => {
        this.latitude = resp.coords.latitude;
        this.longitude = resp.coords.longitude;
        this.adrgps=this.latitude+'--'+this.longitude;
        this.loadingCtrl.dismiss();
      }).catch((error) => {
        this.loadingCtrl.dismiss();
        this.presentAlert('adresse non obtenu!! verifier vos données GPS');
      });
    }
    else{
      this.adrgps='';
      this.readonly=false;;
    }

  }

}
