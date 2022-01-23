import { Injectable } from '@angular/core';
import { POINTS } from '../classes/points';
import { COLS, ROWS } from '../data/constants';
import { Piece } from '../models/piece.model';

@Injectable({
  providedIn: 'root',
})
export class TetrisService {
  constructor() {}

  public onGetEmptyBoard(): Array<Array<number>> {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  public onValid(piece: Piece, board: Array<Array<number>>): boolean {
    return piece.shape.every((row: Array<number>, dy: number) => {
      return row.every((value: number, dx: number) => {
        let x = piece.x + dx;
        let y = piece.y + dy;
        return (
          this._onIsEmpty(value) ||
          (this._onInsideWalls(x) &&
            this._onAboveFloor(y) &&
            this._onNotOccupied(board, x, y))
        );
      });
    });
  }

  private _onIsEmpty(value: number): boolean {
    return value === 0;
  }

  private _onInsideWalls(x: number): boolean {
    return x >= 0 && x < COLS;
  }

  private _onAboveFloor(y: number): boolean {
    return y <= ROWS;
  }

  private _onNotOccupied(
    board: Array<Array<number>>,
    x: number,
    y: number
  ): boolean {
    return board[y] && board[y][x] === 0;
  }

  public onRotate(piece_rotate: Piece): Piece {
    let piece: Piece = JSON.parse(JSON.stringify(piece_rotate));
    for (let i: number = 0; i < piece.shape.length; ++i) {
      for (let j = 0; j < i; ++j) {
        [piece.shape[j][i], piece.shape[i][j]] = [
          piece.shape[i][j],
          piece.shape[j][i],
        ];
      }
    }
    piece.shape.forEach((row: Array<number>) => row.reverse());
    return piece;
  }

  public onGetLinesClearedPoints(lines: number, level: number): number {
    const lineClearPoints =
      lines === 1
        ? POINTS.SINGLE
        : lines === 2
        ? POINTS.DOUBLE
        : lines === 3
        ? POINTS.TRIPLE
        : lines === 4
        ? POINTS.TETRIS
        : 0;

    return (level + 1) * lineClearPoints;
  }
}
