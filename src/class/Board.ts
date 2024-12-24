export class Board {
  board: string[][];
  size: number;
  answers: Set<string>;

  constructor(board: string[][]) {
    this.board = board;
    this.size = board.length;
    this.answers = new Set();
  }
}
