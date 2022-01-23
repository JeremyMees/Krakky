import {
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import {
  COLS,
  ROWS,
  LEVEL,
  LINES_PER_LEVEL,
  COLORS,
} from '../../data/constants';
import { TetrisService } from '../../services/tetris.service';
import { TetrisPiece } from '../../classes/tetris-piece';
import { Moves } from '../../models/moves.model';
import { Piece } from '../../models/piece.model';
import { Time } from '../../models/time.model';
import { POINTS } from '../../classes/points';

@Component({
  selector: 'tetris',
  templateUrl: './tetris.component.html',
  styleUrls: ['./tetris.component.scss'],
})
export class TetrisComponent implements OnInit {
  @Input() width: string | undefined;
  @Output() highscore: EventEmitter<number> = new EventEmitter();
  @ViewChild('board', { static: true })
  canvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('next', { static: true })
  canvas_next!: ElementRef<HTMLCanvasElement>;
  moves: Moves = {
    ArrowLeft: (piece: Piece): Piece => ({ ...piece, x: piece.x - 1 }),
    ArrowRight: (piece: Piece): Piece => ({ ...piece, x: piece.x + 1 }),
    ArrowDown: (piece: Piece): Piece => ({ ...piece, y: piece.y + 1 }),
    Space: (piece: Piece): Piece => ({ ...piece, y: piece.y + 1 }),
    ArrowUp: (piece: Piece): Piece => this.tetrisService.onRotate(piece),
  };
  piece: TetrisPiece | undefined;
  next: TetrisPiece | undefined;
  points: number = 0;
  lines: number = 0;
  level: any;
  time: Time = { start: 0, elapsed: 0, level: 0 };
  ctx!: CanvasRenderingContext2D;
  ctx_next!: CanvasRenderingContext2D;
  block_size: number = 30;
  board: Array<Array<number>> | undefined;
  request_id: number | undefined;

  constructor(private tetrisService: TetrisService) {}

  public ngOnInit(): void {
    this._onCreateBoard();
    this._onInitNext();
    this._onResetGame();
  }

  private _onCreateBoard(): void {
    this.ctx = this.canvas.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    if (this.width) {
      this._onTranformBlockSize();
    }
    this.ctx.canvas.width = COLS * this.block_size;
    this.ctx.canvas.height = ROWS * this.block_size;
    this.ctx.scale(this.block_size, this.block_size);
  }

  private _onInitNext(): void {
    this.ctx_next = this.canvas_next.nativeElement.getContext(
      '2d'
    ) as CanvasRenderingContext2D;
    this.ctx_next.canvas.width = 4 * this.block_size;
    this.ctx_next.canvas.height = 4 * this.block_size;
    this.ctx_next.scale(this.block_size, this.block_size);
  }

  public onPlay(): void {
    this._onResetGame();
    this.board = this.tetrisService.onGetEmptyBoard();
    this.next = new TetrisPiece(this.ctx);
    this.piece = new TetrisPiece(this.ctx);
    this.next.onDrawNext(this.ctx_next);
    this.time.start = performance.now();
    if (this.request_id) {
      cancelAnimationFrame(this.request_id);
    }
    this._onAnimate();
  }

  private _onResetGame() {
    this.points = 0;
    this.lines = 0;
    this.level = 0;
    this.board = this._onGetEmptyBoard();
    this.time = { start: 0, elapsed: 0, level: LEVEL[this.level] };
  }

  private _onAnimate(now: number = 0): void {
    this.time.elapsed = now - this.time.start;
    if (this.time.elapsed > this.time.level) {
      this.time.start = now;
      if (!this._onDrop()) {
        this._onGameOver();
        return;
      }
    }
    this._onDraw();
    this.request_id = requestAnimationFrame(this._onAnimate.bind(this));
  }

  private _onDraw(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
    this.piece!.onDraw();
    this._onDrawBoard();
  }

  private _onDrop(): boolean {
    let piece = this.moves['ArrowDown'](this.piece!);
    if (this.tetrisService.onValid(piece, this.board!)) {
      this.piece!.onMove(piece);
    } else {
      this._onFreeze();
      this._onClearLines();
      if (this.piece!.y === 0) {
        return false;
      }
      this.piece = this.next;
      this.next = new TetrisPiece(this.ctx);
      this.next.onDrawNext(this.ctx_next);
    }
    return true;
  }

  private _onClearLines(): void {
    let lines = 0;
    this.board!.forEach((row: Array<number>, i: number) => {
      if (row.every((value: number) => value !== 0)) {
        lines++;
        this.board!.splice(i, 1);
        this.board!.unshift(Array(COLS).fill(0));
      }
    });
    if (lines > 0) {
      this.points += this.tetrisService.onGetLinesClearedPoints(
        lines,
        this.level
      );
      this.lines += lines;
      if (this.lines >= LINES_PER_LEVEL) {
        this.level++;
        this.lines -= LINES_PER_LEVEL;
        this.time.level = LEVEL[this.level];
      }
    }
  }

  private _onFreeze(): void {
    this.piece!.shape.forEach((row: Array<number>, i: number) => {
      row.forEach((value: number, j: number) => {
        if (value > 0) {
          this.board![i + this.piece!.y][j + this.piece!.x] = value;
        }
      });
    });
  }

  private _onDrawBoard(): void {
    this.board!.forEach((row: Array<number>, i: number) => {
      row.forEach((value: number, j: number) => {
        if (value > 0) {
          const color: string = `rgb(${COLORS[value].r},${COLORS[value].g},${COLORS[value].b}, 0.75)`;
          this.ctx.fillStyle = color;
          this.ctx.fillRect(j, i, 1, 1);
        }
      });
    });
  }

  private _onTranformBlockSize(): void {
    const numbers: RegExpMatchArray | null = this.width!.match(/(\d+)/);
    if (numbers) {
      const width: number = Number(numbers[0]);
      this.block_size = width / COLS;
    }
  }

  private _onGameOver() {
    cancelAnimationFrame(this.request_id as number);
    this.ctx.fillStyle = '#ffffff';
    this.ctx.fillRect(1, 3, 8, 1.2);
    this.ctx.font = '1px retro';
    this.ctx.fillStyle = '#000000';
    this.ctx.fillText('GAME OVER', 1.8, 4);
    this.highscore.emit(this.points);
  }

  private _onGetEmptyBoard(): Array<Array<number>> {
    return Array.from({ length: ROWS }, () => Array(COLS).fill(0));
  }

  @HostListener('window:keydown', ['$event'])
  keyEvent(event: KeyboardEvent) {
    const key: string = event.code === 'Space' ? event.code : event.key;
    if (key === 'Escape') {
      this._onGameOver();
    } else if (this.moves[key]) {
      event.preventDefault();
      let piece = this.moves[key](this.piece as Piece);
      if (key === 'Space') {
        while (this.tetrisService.onValid(piece, this.board!)) {
          this.points += POINTS.HARD_DROP;
          this.piece!.onMove(piece);
          piece = this.moves[key](this.piece!);
        }
      } else if (this.tetrisService.onValid(piece, this.board!)) {
        this.piece!.onMove(piece);
        if (key === 'ArrowDown') {
          this.points += POINTS.SOFT_DROP;
        }
      }
      this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
      this.piece!.onDraw();
    }
  }
}
