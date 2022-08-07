import { Component, OnInit, ViewChild,NgZone } from '@angular/core';
import { ApiService } from 'src/app/api.service';
import { ActivatedRoute} from '@angular/router';
import { IonContent } from '@ionic/angular';
import { DataService } from 'src/app/services/data/data.service';
@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.page.html',
  styleUrls: ['./chatbot.page.scss'],
})
export class ChatbotPage implements OnInit {
  chat: string;
  type1: string;
  idUser: any;
  conversation= [];
  start: number;
  limit: number;
  maxLength: number;
  date: string;
  verif: boolean;
  pageNumber: number;
  nbrPages: number;
  verifLng: boolean;
  languageSelected: string;
  newChoice: boolean;
  tryagain: string;
  isLoaded=true;

  // eslint-disable-next-line @typescript-eslint/member-ordering
  @ViewChild(IonContent, {static: true}) content: IonContent;
  constructor(public apiService: ApiService,public activateroute: ActivatedRoute,public _zone: NgZone
    ,public dataService: DataService) { }

  ngOnInit() {
    this.pageNumber=1;
    this.verif=false;
    this.verifLng=true;
    this.newChoice=false;
    this.scrollToBottom();
    this.maxLength=0;
    this.start =0;
    this.limit=10;
    this.date='';
    this.idUser=this.activateroute.snapshot.paramMap.get('iduser');
    this.date=this.getTime();
    const start={
      // eslint-disable-next-line max-len
      value:this.dataService.doTranslate('welcome to chat'),
      type:'part12',
      time:this.date
    };
    this.conversation.splice(0, 0, start);
    this.loadChat(this.pageNumber);
  }

  lang(language){
    this.languageSelected=language;
    this.verifLng=false;
  }
  changeLanguage(language){
    if(language==='no'){
      this.newChoice=false;
    }
    else{
      this.newChoice=false;
      const start={
        value:this.dataService.doTranslate('choose the chat language'),
        type:'part12',
        time:this.date
      };
      this.conversation.push(start);
      this.verifLng=true;
    }
  }
  scrollToBottom()
{
    // eslint-disable-next-line no-underscore-dangle
    this._zone.run(() => {

      const duration = 300;

      setTimeout(() => {
        this.content.scrollToBottom(duration).then(()=>{

          setTimeout(()=>{

            this.content.getScrollElement().then((element: any)=>{

              if (element.scrollTopMax !== element.scrollTop)
              {
                // trigger scroll again.
                this.content.scrollToBottom(duration).then(()=>{

                  // loaded... do something

                });
              }
              else
              {
                // loaded... do something
              }
            });
          });
        });

      },20);
    });
  }

  loadChat(page){
    this.apiService.getChatAPI(this.idUser,page).subscribe((res: any) => {
      if(res.status === 'succes'){
        this.nbrPages=res.nbr;
        for(const datas of res.data){
          this.maxLength=datas.max;
          const chat={
            type:datas.type,
            value:datas.message,
            time:datas.created_at
          };
          //this.conversation.push(chat);
          this.conversation.splice(0, 0, chat);
        }
        //console.log(this.conversation);
        //this.conversation.reverse();
        if(this.nbrPages>1){
          this.verif=true;
        }
        this.isLoaded=false;
      }
      else {
        this.isLoaded=false;
        console.log(res.status);
      }
    },(error: any) => {
       console.log('erroe');});
  }

  loadData(event) {
    setTimeout(() => {
      if(this.pageNumber<this.nbrPages){
        this.pageNumber++;
         //this.conversation.reverse();
      this.loadChat(this.pageNumber);
      event.target.complete();
      if (Number(this.pageNumber) === Number(this.nbrPages)) {
        //this.conversation.reverse();
        event.target.disabled = true;
      }
      }

      // App logic to determine if all data is loaded
      // and disable the infinite scroll
    }, 2000);
  }

  chatbot(){
    this.date=this.getTime();
    const question={
      type:'part11',
      value:this.chat,
      time:this.date
    };
   // this.conversation.push(question);
    this.conversation.push(question);
    this.scrollToBottom();
    const data={
      qst:this.chat.split(' ').join('*')
    };
    if(this.chat!= null){
      const save={
        message:this.chat,
        type:'part11',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_id:this.idUser
      };
      this.apiService.saveChaatAPI(save).subscribe((res: any) => {
      },(error: any) => {});
    this.chat='';
    this.apiService.chatbot(data,this.languageSelected).subscribe((res: any) => {
      this.date=this.getTime();
      if(res.chatbot==='try again'){
         this.tryagain=this.dataService.doTranslate('try_again');
      }
      else{
        this.tryagain=res.chatbot;
      }
      const reponse={
        type:'part12',
        value:this.tryagain,
        time:this.date
      };
      //this.conversation.push(reponse);
      this.conversation.push(reponse);
      this.scrollToBottom();
      if(reponse.value===this.dataService.doTranslate('try_again')){
        const start={
          value:this.dataService.doTranslate('chat lang'),
          type:'part12',
          time:this.date
        };
        this.conversation.push(start);
        this.newChoice=true;
      }
      const savePlus={
        message:reponse.value,
        type:'part12',
        // eslint-disable-next-line @typescript-eslint/naming-convention
        user_id:this.idUser
      };
      this.apiService.saveChaatAPI(savePlus).subscribe((resPlus: any) => {
      },(error: any) => {});
    },(error: any) => {
      console.log('erroe');});
  }
  }
  getTime(){
    return (new Date().toISOString().slice(0, -8).replace('T',' '));
  }

}
