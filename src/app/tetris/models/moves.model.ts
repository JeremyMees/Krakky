import { Piece } from './piece.model';

export interface Moves {
  [key: string]: (piece: Piece) => Piece;
}
