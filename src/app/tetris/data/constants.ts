export const COLS = 10;
export const ROWS = 20;
export const LINES_PER_LEVEL = 10;
// colors zetten dat {r,g,b} zodat ik ook border kan zettemn
export const COLORS: Array<{ r: number; g: number; b: number }> = [
  { r: 0, g: 0, b: 0 },
  { r: 0, g: 255, b: 242 },
  { r: 21, g: 0, b: 242 },
  { r: 255, g: 145, b: 0 },
  { r: 211, g: 207, b: 1 },
  { r: 47, g: 255, b: 0 },
  { r: 180, g: 2, b: 255 },
  { r: 255, g: 0, b: 0 },
];
export const SHAPES: Array<Array<Array<number>>> = [
  [],
  [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  [
    [2, 0, 0],
    [2, 2, 2],
    [0, 0, 0],
  ],
  [
    [0, 0, 3],
    [3, 3, 3],
    [0, 0, 0],
  ],
  [
    [4, 4],
    [4, 4],
  ],
  [
    [0, 5, 5],
    [5, 5, 0],
    [0, 0, 0],
  ],
  [
    [0, 6, 0],
    [6, 6, 6],
    [0, 0, 0],
  ],
  [
    [7, 7, 0],
    [0, 7, 7],
    [0, 0, 0],
  ],
];
export const LEVEL: { [key: number]: number } = {
  0: 800,
  1: 720,
  2: 630,
  3: 550,
  4: 470,
  5: 380,
  6: 300,
  7: 220,
  8: 130,
  9: 100,
  10: 80,
  11: 80,
  12: 80,
  13: 70,
  14: 70,
  15: 70,
  16: 50,
  17: 50,
  18: 50,
  19: 30,
  20: 30,
};
