import { EventEmitter, Injectable } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root'
})
export class OnlineGameService {

  private _board: string[][] = [['*', '*', '*'], ['*', '*', '*'], ['*', '*', '*']];
  private _player: any = { username: '', symbol: '' };
  private _player2: any = { username: '', symbol: '' };
  private _actualTurn: string = '';
  private _isEnded: boolean = false;
  private _hasStarted: boolean = false;
  onPlayAgain: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  onPlayEnded: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _alertCtrl: AlertController, private _socket: Socket,
    private _navCtrl: NavController) { }
  
  async createRoom(username: string, symbol: string, password: string) {
    this._socket.connect();
    this._socket.emit('createRoom', { owner: username, symbol: symbol, password: password });
    this._player = { username: username, symbol: symbol };
  }

  async joinRoom(username: string, password: string, roomID: number) {
    this._socket.emit('joinRoom', { username: username, password: password, room: roomID });
    this._socket.on('joinedRoom', async (data: any) => {
      this._player = { username: data.owner.username, symbol: data.owner.username };
      this._player2 = { username: username, symbol: data.owner.symbol === 'X' ? 'O' : 'X' };
      this._navCtrl.navigateRoot('/game');
      await this.init();
      await this._navCtrl.navigateRoot('/online-game');
    });
  }

  async init() {
    this._board = [['*', '*', '*'], ['*', '*', '*'], ['*', '*', '*']];
    this._hasStarted = true;
    this._isEnded = false;

    this._actualTurn = Math.floor(Math.random() * 2) + 1 === 1 ? this._player : this._player2;
  }
}
