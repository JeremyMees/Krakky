import { COLORS, SHAPES } from '../data/constants';
import { Piece } from '../models/piece.model';

export class TetrisPiece implements Piece {
  x!: number;
  y!: number;
  color!: string;
  shape!: Array<Array<number>>;

  constructor(private ctx: CanvasRenderingContext2D) {
    this.onSpawn();
  }

  public onSpawn(): void {
    const random: number = this._onRandomizeTetrominoType(COLORS.length - 1);
    this.shape = SHAPES[random];
    this.color = `rgb(${COLORS[random].r},${COLORS[random].g},${COLORS[random].b}, 0.75)`;
    this.x = random === 4 ? 4 : 3;
    this.y = 0;
  }

  public onDraw(): void {
    this.ctx.fillStyle = this.color;
    this.shape.forEach((row: Array<number>, y: number) => {
      row.forEach((value: number, x: number) => {
        if (value > 0) {
          this.ctx.fillRect(this.x + x, this.y + y, 1, 1);
        }
      });
    });
  }

  public onDrawNext(ctx_next: CanvasRenderingContext2D) {
    ctx_next.clearRect(0, 0, ctx_next.canvas.width, ctx_next.canvas.height);
    ctx_next.fillStyle = this.color;
    this.shape.forEach((row: Array<number>, y: number) => {
      row.forEach((value: number, x: number) => {
        if (value > 0) {
          ctx_next.fillRect(x, y, 1, 1);
        }
      });
    });
  }

  public onMove(piece: Piece) {
    this.x = piece.x;
    this.y = piece.y;
    this.shape = piece.shape;
  }

  private _onRandomizeTetrominoType(length: number): number {
    return Math.floor(Math.random() * length + 1);
  }
}
