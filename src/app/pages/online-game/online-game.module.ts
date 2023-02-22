import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OnlineGamePageRoutingModule } from './online-game-routing.module';

import { OnlineGamePage } from './online-game.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    OnlineGamePageRoutingModule
  ],
  declarations: [OnlineGamePage]
})
export class OnlineGamePageModule {}
