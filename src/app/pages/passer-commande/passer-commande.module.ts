import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PasserCommandePageRoutingModule } from './passer-commande-routing.module';

import { PasserCommandePage } from './passer-commande.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PasserCommandePageRoutingModule,
    ReactiveFormsModule
  ],
  declarations: [PasserCommandePage]
})
export class PasserCommandePageModule {}
