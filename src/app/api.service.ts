/* eslint-disable @typescript-eslint/naming-convention */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DataService } from 'src/app/services/data/data.service';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  //headers: HttpHeaders;
  adress: string;
  address_API: string;
  dataStorage: any;
  tokenKey: string;


  constructor(public http: HttpClient,public dataService: DataService,private storage: Storage) {

    this.adress=dataService.url+'/tutoriel/api';
    this.address_API=dataService.urlAPI;
  }

  getHeaders(token){
    const headerss = new HttpHeaders().set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .set('responseType', 'text')
    .set('Authorization',  'Bearer ' + token);
    return headerss;
  }
  async setToken(){
    await this.storage.create();
    this.storage.get('storage_xxx').then((res)=>{
      if(res!=null){
        this.dataStorage=res;
        this.tokenKey=this.dataStorage.token;
      }
    });
  }

  add_API(data){
    return this.http.post(this.address_API+'/api/v1/register',data);
  }

  login_API(data){
    return this.http.post(this.address_API+'/api/v1/login',data);
  }

  getData_API(country,page){
    this.setToken();
    return this.http.get(this.address_API+'/api/v1/users/search/'+country+'?page='+page);
  }

  logout_API(){
    return this.http.post(this.address_API+'/api/v1/logout',null,{headers:this.getHeaders(this.tokenKey)});
  }

  addPlatAPI(data){
  const getHead=this.getHeaders(this.tokenKey);
  return this.http.post(this.address_API+'/api/v1/plats',data,{headers:getHead});
  }

  getListFoodAPI(id,page){
    return this.http.get(this.address_API+'/api/v1/plats/search/'+id+'?page='+page);
  }

  deletePlatAPI(id){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.delete(this.address_API+'/api/v1/plats/'+id,{headers:getHead});
  }

  updatePlatAPI(id,data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.put(this.address_API+'/api/v1/plats/'+id,data,{headers:getHead});
  }

  getFoodByIdAPI(id){
    return this.http.get(this.address_API+'/api/v1/plats/'+id);
  }

  getListCommentAPI(id,page){
    return this.http.get(this.address_API+'/api/v1/commentaires/search/'+id+'?page='+page);
  }

  addCommentAPI(data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.post(this.address_API+'/api/v1/commentaires',data,{headers:getHead});
  }

  passerCmdAPI(data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.post(this.address_API+'/api/v1/commandes',data,{headers:getHead});
  }

  updatePlatNumberAPI(id,data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.put(this.address_API+'/api/v1/plats/platnumber/'+id,data,{headers:getHead});
  }

  passercmdAPI(data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.post(this.address_API+'/api/v1/commandes',data,{headers:getHead});
  }

  getHistoCmdApi(id,page){
    return this.http.get(this.address_API+'/api/v1/commandes/search/'+id+'?page='+page);
  }

  getListLivraisonAPI(id){
    return this.http.get(this.address_API+'/api/v1/commandes/searchlivraisons/'+id);
  }

  getUserByIdAPI(id){
    return this.http.get(this.address_API+'/api/v1/users/'+id);
  }

  updateUserImageAPI(id,data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.put(this.address_API+'/api/v1/users/images/'+id,data,{headers:getHead});
  }

  getChatAPI(id,page){
   return this.http.get(this.address_API+'/api/v1/chats/'+id+'?page='+page);
  }

  saveChaatAPI(data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.post(this.address_API+'/api/v1/chats',data,{headers:getHead});
  }

  chatbot(data,language){
    switch(language) {
      case 'FR': {
        return this.http.post(this.address_API+'/storage/app/script/versionFR/first.php',data);
         break;
      }
      case 'EN': {
        return this.http.post(this.address_API+'/storage/app/script/versionEN/first.php',data);
         break;
      }
      case 'TN': {
        return this.http.post(this.address_API+'/storage/app/script/newversion/first.php',data);
         break;
      }
   }
  }

  ratingAPI(data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.post(this.address_API+'/api/v1/rating',data,{headers:getHead});
  }

  getStatAPI(data){
    const getHead=this.getHeaders(this.tokenKey);
    return this.http.post(this.address_API+'/api/v1/stat',data,{headers:getHead});
  }

}
