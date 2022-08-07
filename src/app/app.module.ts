import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { IonicStorageModule } from '@ionic/storage-angular';
import {HttpClientModule} from '@angular/common/http';
import { SearchFilterPipe } from './search-filter.pipe';

import { Camera } from '@ionic-native/camera/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DataService } from './services/data/data.service';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { AdMobFree } from '@ionic-native/admob-free/ngx';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { SplashScreen } from '@awesome-cordova-plugins/splash-screen/ngx';







@NgModule({
  declarations: [AppComponent, SearchFilterPipe],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,IonicStorageModule.forRoot(),
    HttpClientModule],
  providers: [
    Camera,Geolocation,ScreenOrientation,AdMobFree,SplashScreen,
    {provide: LocationStrategy, useClass: HashLocationStrategy},DataService],
  bootstrap: [AppComponent],
})
export class AppModule {}
