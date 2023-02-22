import { Injectable } from '@angular/core';
import { Util } from '../classes/util';
import { Difficulty } from '../enums/difficulty';

@Injectable({
  providedIn: 'root'
})
export class CPUService {

  private _difficulty!: Difficulty;

  constructor() { }

  init(difficulty: string) {
    if (difficulty.toLowerCase() === 'easy') this._difficulty = Difficulty.EASY;
    else if (difficulty.toLowerCase() === 'medium') this._difficulty = Difficulty.MEDIUM;
    else if (difficulty.toLowerCase() === 'hard') this._difficulty = Difficulty.HARD;
  }

  thinkPlay(board: string[][], player: string, CPU: string): number[] {
    // Board is an array of 9 which contains a * as a placeholder for an empty space
    // and a 0 or 1 for the player or cpu
    let row: number = -1, col: number = -1;
    if (this._difficulty === Difficulty.EASY) {
      // Here the CPU will play randomly
      do {
        row = Math.floor(Math.random() * 3);
        col = Math.floor(Math.random() * 3);
      } while (board[row][col] !== '*');
      return [row, col];
    } else if (this._difficulty === Difficulty.MEDIUM) {
      // Here the CPU will try to draw or randomly play
      // If the board is empty, play in the center
      if (board.every(row => row.every(col => col === ''))) {
        row = 1; col = 1;
      } else {
        // If the board is not empty, play in a random corner
        if (board[0][0] === '') {
          row = 0; col = 0;
        } else if (board[0][2] === '') {
          row = 0; col = 2;
        } else if (board[2][0] === '') {
          row = 2; col = 0;
        } else if (board[2][2] === '') {
          row = 2; col = 2;
        }
        if (col === -1) {
          // If there are no corners available, play randomly
          do {
            row = Math.floor(Math.random() * 3);
            col = Math.floor(Math.random() * 3);
          } while (board[row][col] !== '*');
        }
      }
      return [row, col];
    } else if (this._difficulty === Difficulty.HARD) {
      // Here the CPU will try to win or draw or win
      // We check if the CPU can win in the next move
      let newBoard = board.map(row => row.map(col => col));
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (newBoard[row][col] === '*') {
            newBoard[row][col] = CPU;
            if (Util.checkWinner(newBoard, CPU)) {
              return [row, col];
            }
            newBoard[row][col] = '';
          }
        }
      }

      // We check if the player can win in the next move
      newBoard = board.map(row => row.map(col => col));
      for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
          if (newBoard[row][col] === '*') {
            newBoard[row][col] = player;
            if (Util.checkWinner(newBoard, player)) {
              return [row, col];
            }
            newBoard[row][col] = '*';
          }
        }
      }

      // At this point, the CPU will play randomly
      do {
        row = Math.floor(Math.random() * 3);
        col = Math.floor(Math.random() * 3);
      } while (board[row][col] !== '*');
      return [row, col];
    }
    return [row, col]
  }

  getDifficulty(): Difficulty {
    return this._difficulty;
  }
}
