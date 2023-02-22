import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OnlineGamePage } from './online-game.page';

const routes: Routes = [
  {
    path: '',
    component: OnlineGamePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OnlineGamePageRoutingModule {}
