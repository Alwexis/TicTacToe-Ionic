import { EventEmitter, Injectable, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { Util } from '../classes/util';
import { CPUService } from './cpu.service';

@Injectable({
  providedIn: 'root'
})
export class GameService implements OnInit {

  private _board: string[][] = [['*', '*', '*'], ['*', '*', '*'], ['*', '*', '*']];
  private _player: string = '';
  private _player2: string = ''; // CPU if is Offline
  private _actualTurn: string = '';
  private _isOnline!: boolean;
  private _isEnded: boolean = false;
  onPlayAgain: EventEmitter<Boolean> = new EventEmitter<Boolean>();
  onPlayEnded: EventEmitter<void> = new EventEmitter<void>();

  constructor(private _alertCtrl: AlertController, private _cpu: CPUService,
    private _navCtrl: NavController) {
  }

  async init(player: string, difficulty: string, isOnline: boolean) {
    this._board = [['*', '*', '*'], ['*', '*', '*'], ['*', '*', '*']];
    this._isOnline = isOnline;
    this._isEnded = false;
    if (player.toLowerCase() === 'x') {
      this._player = 'X';
      this._player2 = 'O';
    } else {
      this._player = 'O';
      this._player2 = 'X';
    }
    if (!this._isOnline) {
      this._cpu.init(difficulty);
    }
    this._actualTurn = Math.floor(Math.random() * 2) + 1 === 1 ? this._player : this._player2;
    await this._navCtrl.navigateRoot('/game');
    if (this._actualTurn === this._player2 && !this._isOnline) {
      setTimeout(async () => {
        await this.playCPU();
      }, 1500);
    }
  }

  async ngOnInit() {
  }

  async play(x: number, y: number) {
    if (!this._isOnline) {
      if (this._actualTurn === this._player) {
        if (this._board[x][y] === '*') {
          this._board[x][y] = this._player;
          this._isEnded = await this.checkIfWinner();
          if (!this._isEnded) {
            this._actualTurn = this._player2;
            this.onPlayEnded.emit();
          }
        }
      }
    }
  }

  async playCPU() {
    const CPUChoice = this._cpu.thinkPlay(this._board, this._player, this._player2);
    this._board[CPUChoice[0]][CPUChoice[1]] = this._player2;
    this._isEnded = await this.checkIfWinner();
    if (!this._isEnded) {
      this._actualTurn = this._player;
      this.onPlayEnded.emit();
    }
  }

  async checkIfWinner() {
    if (!this._isOnline) {
      if (Util.checkWinner(this._board, this._player)) {
        const alert = await this._alertCtrl.create({
          header: 'You won!',
          message: 'Congratulations, you won the game!',
          htmlAttributes: {
            id: 'WonAllert'
          },
          cssClass: 'GameAlert',
          buttons: [{
            text: 'OK',
            handler: async () => {
              await this._navCtrl.navigateRoot('/home');
            }
          },
          {
            text: 'Play again',
            handler: async () => {
              await this.init(this._player, this._cpu.getDifficulty(), this._isOnline);
              this.onPlayAgain.emit(true);
            }
          }
          ]
        });
        const alertMessage = alert.querySelector('.alert-head');
        if (alertMessage) {
          alertMessage.innerHTML += '<img src="../../../assets/images/win.png">'
        }
        await alert.present();
        return true;
      } else if (Util.checkWinner(this._board, this._player2)) {
        const alert = await this._alertCtrl.create({
          header: 'You lost!',
          message: 'Sorry, you lost the game! Better luck next time!',
          htmlAttributes: {
            id: 'LostAllert'
          },
          cssClass: 'GameAlert',
          buttons: [{
            text: 'OK',
            handler: async () => {
              await this._navCtrl.navigateRoot('/home');
            }
          },
          {
            text: 'Play again',
            handler: async () => {
              await this.init(this._player, this._cpu.getDifficulty(), this._isOnline);
              this.onPlayAgain.emit(true);
            }
          }]
        });
        const alertMessage = alert.querySelector('.alert-head');
        if (alertMessage) {
          alertMessage.innerHTML += '<img src="../../../assets/images/lose.png">'
        }
        await alert.present();
        return true;
      } else {
        // Check if its a draw or not.
        const isADraw = this._board.every(row => row.every(col => col !== '*'));
        if (isADraw) {
          const alert = await this._alertCtrl.create({
            header: 'Draw!',
            message: 'Its a draw! Better luck next time! ',
            htmlAttributes: {
              id: 'DrawAllert'
            },
            cssClass: 'GameAlert',
            buttons: [{
              text: 'OK',
              handler: async () => {
                await this._navCtrl.navigateRoot('/home');
              }
            },
            {
              text: 'Play again',
              handler: async () => {
                await this.init(this._player, this._cpu.getDifficulty(), this._isOnline);
                this.onPlayAgain.emit(true);
              }
            }
            ]
          });
          const alertMessage = alert.querySelector('.alert-head');
          if (alertMessage) {
            alertMessage.innerHTML += '<img src="../../../assets/images/draw.png">'
          }
          await alert.present();
          return true;
        }
      }
    }
    return false;
    // Later Im gonna implement the online part :p.
  }

  getBoard() {
    return this._board;
  }

  getTurn() {
    return this._actualTurn;
  }

  getIconFromTurn() {
    return this._actualTurn === this._player ? this._player : this._player2;
  }

  isEnded() {
    return this._isEnded;
  }

  isOnline() {
    return this._isOnline;
  }

  getPlayers() {
    return [this._player, this._player2];
  }

}
