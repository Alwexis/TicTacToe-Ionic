import { Component, OnInit } from '@angular/core';
import { GameService } from 'src/app/services/game.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  board: string[][];
  turn!: string;
  icon: string;
  // Only for online game
  private _isOnline: boolean = false;
  title: string = 'X v/s O';

  constructor(private _game: GameService) {
    this.board = this._game.getBoard();
    this.icon = this._game.getIconFromTurn();
    this.getActualTurn();
    this._game.onPlayAgain.subscribe(async (playAgain: boolean) => {
      if (playAgain) {
        this.board = this._game.getBoard();
        this.turn = this._game.getTurn();
        this.getActualTurn();
        this.icon = this._game.getIconFromTurn();
      }
    });
    this._game.onPlayEnded.subscribe(() => {
      this.getActualTurn();
    });
  }

  ngOnInit() {
  }

  async play(x: number, y: number) {
    if (this.board[x][y] !== '*') return;
    await this._game.play(x, y);
    if (!this._game.isEnded()) {
      setTimeout(async () => {
        await this._game.playCPU();
      }, 1500);
    }
  }

  getActualTurn() {
    if (!this._game.isOnline()) {
      const players = this._game.getPlayers();
      const turn = this._game.getTurn();
      this.board = this._game.getBoard();
      this.icon = this._game.getIconFromTurn();
      this.turn = players[0] === turn ? 'Player' : 'CPU';
    }
    return '';
  }
}
