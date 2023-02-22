import { Component, OnInit } from '@angular/core';
import { ActionSheetController, AlertController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';
import { GameService } from 'src/app/services/game.service';
import { OnlineGameService } from 'src/app/services/online-game.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  difficulty: string = 'easy';
  symbol: string = 'x';
  // Only for Online
  username: string = '';
  password: string = '';
  roomId: number = 0;

  constructor(private _alertCtrl: AlertController, private _actionsheetCtrl: ActionSheetController,
    private _gameServ: GameService, private _onlineGameServ: OnlineGameService,
    private _socket: Socket) {
    }

  ngOnInit() {
    //this._socket.connect();
  }

  async startGame(pvp: boolean, modal: any) {
    modal.dismiss();
    await this._gameServ.init(this.symbol, this.difficulty, pvp);
  }

  async createRoom() {
    if (this.username !== '') {
      await this._onlineGameServ.createRoom(this.username, this.symbol, this.password);
    }
  }

}
