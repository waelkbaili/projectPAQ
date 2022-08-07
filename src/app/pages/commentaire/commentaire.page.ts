import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/api.service';
import { Storage } from '@ionic/storage-angular';
import { ActionSheetController, AlertController, LoadingController, NavController,ToastController } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';

@Component({
  selector: 'app-commentaire',
  templateUrl: './commentaire.page.html',
  styleUrls: ['./commentaire.page.scss'],
})
export class CommentairePage implements OnInit {
  items= [];
  idFood: any;
  name: any;
  start: number;
  limit: number;
  comment: string ;
  params: string;
  type: string;
  pageNumber: number;
  nbrPages: number;
  commentholder: string;
  isLoaded=true;
  constructor(public dataService: DataService,public apiService: ApiService,public storage: Storage,
    public actionSheetController: ActionSheetController,public navctrl: NavController,public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,public toastController: ToastController) {
   }

  ngOnInit() {
    this.commentholder=this.dataService.doTranslate('write any comment here...');
    this.pageNumber=1;
    this.comment='';
    this.start =0;
    this.limit=10;
    this.params=this.dataService.getParams().param;
    this.idFood=this.params.split('/')[0];
    this.type=this.params.split('/')[1];
    this.storage.create();
    this.storage.get('storage_xxx').then((res)=>{
      if(res!=null){
        if(this.type==='A'){
          this.name=res.name+': Auteur';
        }
        else{
          this.name=res.name;
        }
      }
    });
    this.addMoreItems(this.pageNumber);
  }
  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      //this.start=this.start+this.limit-1;
      if(this.pageNumber<this.nbrPages){
        this.pageNumber++;
        this.addMoreItems(this.pageNumber);
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
  addMoreItems(page){
   // this.items=[];
    /*const data = {
      start: this.start,
      limit: this.limit,
      foodId: this.idFood
    };*/
    this.apiService.getListCommentAPI(this.idFood,page).subscribe((res: any) => {
      if(res.status === 'succes'){
       // console.log(res.status);
       this.nbrPages=res.nbr;
        for(const datas of res.data){
          this.items.push(datas);
        }
        console.log(res.data);
        this.isLoaded=false;
      }
      else {
        this.isLoaded=false;
        console.log(res.status);
      }
    },(error: any) => {
      this.presentAlert(this.dataService.doTranslate('time out'),'addmore');
       console.log('erroe');});
    }
  addComment(){
    if(this.comment!== ''){
      const commentaire={
        createur:this.name,
        commentaire:this.comment,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        plat_id:this.idFood
      };
      console.log(commentaire);
      this.apiService.addCommentAPI(commentaire).subscribe((res: any) => {
        //console.log(res.status);
        if(res.status === 'succes'){
          this.comment='';
          this.items=[];
          //this.start=0;
          this.addMoreItems(1);
          //this.ngOnInit();
        }
        else {
          console.log(res.status);
        }
      },(error: any) => {
        this.presentAlert(this.dataService.doTranslate('time out'),'addcomment');
        console.log('erroe');});
    }
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
            if(param==='addmore'){
              this.addMoreItems(this.pageNumber);
            }
            if(param==='addcomment'){
              this.addComment();
            }
          }
        }
      ]
    });
    await alert.present();
  }
  }
