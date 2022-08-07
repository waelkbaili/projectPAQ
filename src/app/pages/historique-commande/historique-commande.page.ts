import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { ApiService } from 'src/app/api.service';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-historique-commande',
  templateUrl: './historique-commande.page.html',
  styleUrls: ['./historique-commande.page.scss'],
})
export class HistoriqueCommandePage implements OnInit {
  data: any;
  cmds: any =[];
  plats: any =[];
  dateex: string;
  datenv: string;
  verif: boolean;
  rate: number;
  start: number;
  limit: number;
  pageNumber: number;
  nbrPages: number;
  falseDate: string;
  isLoaded=true;



  constructor(private storage: Storage, private navCtrl: NavController,private alertCtrl: AlertController,
    public apiService: ApiService,public loadingCtrl: LoadingController,public activateroute: ActivatedRoute,
    public dataService: DataService) { }

  ngOnInit() {
    this.pageNumber=1;
    this.start =0;
    this.limit=10;
    this.verif=false;
    this.dateex='';
    this.datenv='';
    this.rate=0;
    this.data=this.activateroute.snapshot.paramMap.get('iduser');
    this.getHostorique(this.pageNumber);
  }
  async rating(foodIdPlus,timePlus){
      const alert = await this.alertCtrl.create({
        cssClass: 'my-custom-class',
        header: 'noter ce plat (1-5)',
        inputs: [
          {
            name: 'name6',
            type: 'number',
            value:1,
            max:5,
            min:1
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
                if(Number(dataaa.name6)>5 || Number(dataaa.name6)<1){
                  //console.log('svp donner une note entre 0 et 10');
                  this.rating(foodIdPlus,timePlus);
                }
                else{
                  //Find index of specific object using findIndex method.
                  const objIndex = this.plats.findIndex((obj => (obj.foodId === foodIdPlus && obj.time === timePlus) ));
                  //Log object to Console.
                  console.log(this.plats[objIndex]);
                  //Update object's name property.
                  this.plats[objIndex].rate = dataaa.name6;
                  const dataRate ={
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    client_id:this.data,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    created_at:timePlus,
                    rate:dataaa.name6,
                    // eslint-disable-next-line @typescript-eslint/naming-convention
                    plat_id:foodIdPlus
                  };
                  console.log(dataRate);
                  this.apiService.ratingAPI(dataRate).subscribe((res: any) => {
                    if(res.status === 'succes'){
                      //loader.dismiss();
                      console.log(res.status);
                      //this.cmds=[];
                     // this.storage.set(this.data,this.cmds);
                      //this.verif=false;
                      //this.presentToast(res.status);
                      //this.navCtrl.navigateBack('/listfood/'+this.idRecap);
                      //this.navCtrl.pop();
                    }
                    else {
                    //loader.dismiss();
                    console.log(res.status);
                    //this.presentToast(res.status);
                    }
                  },(error: any) => {
                    this.presentAlert(this.dataService.doTranslate('time out'),'rate',foodIdPlus,timePlus);
                    console.log('error',error);
                    //loader.dismiss();
                    //this.presentAlert('Time Out');
                  });
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
        this.getHostorique(this.pageNumber);
        event.target.complete();
      }
      if (Number(this.pageNumber) === Number(this.nbrPages)) {
        //this.conversation.reverse();
        event.target.disabled = true;
      }
      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 2000);
  }
  getHostorique(page){

    this.apiService.getHistoCmdApi(this.data,page).subscribe((res: any) => {
      if(res.status === 'succes'){
        this.verif=true;
        for(const cmd of res.data){
          this.nbrPages=res.nbr;
          for(const val of (cmd.listCmd)){
            this.falseDate=cmd.created_at;
            this.falseDate= this.falseDate.replace('T',' ').slice(0,-8);
            const plat ={
              foodId:val.split('@')[0],
              cuistotName:cmd.cuistotname,
              time:this.falseDate,
              name:val.split('@')[2],
              nbr:val.split('@')[1],
              rate:val.split('@')[3]
            };
              //console.log(cmd.time);
              //console.log(this.dateex);
            if(cmd.created_at===this.dateex){
              //plat.time='';
              plat.cuistotName='';
            }
            else{
              this.dateex=cmd.created_at;
            }
            this.plats.push(plat);
          }
        }
        //console.log(this.plats);
        this.isLoaded=false;
      }
      else {
        this.isLoaded=false;
      }
    },(error: any) => {
      this.presentAlert(this.dataService.doTranslate('time out'),'histo',null,null);
      console.log('erroe');});
  }
  async presentAlert(msg,param,foodIdPlus,timePlus) {
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
            if(param==='rate'){
              this.rating(foodIdPlus,timePlus);
            }
            if(param==='histo'){
              this.getHostorique(this.pageNumber);
            }
          }
        }
      ]
    });

    await alert.present();
  }
  }
