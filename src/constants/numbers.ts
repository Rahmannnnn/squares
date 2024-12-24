import { Position } from "../interfaces/Position";

export const MIN_LENGTH = 4;
export const MAX_LENGTH = 6;

export const WORD_MIN_LENGTH = 4;
export enum MODE {
  QUESTION = "Question",
  ANSWER = "Answer",
}

export const MOVE: Position[] = [
  { x: 1, y: 0 }, // right
  { x: -1, y: 0 }, // left
  { x: 0, y: 1 }, // bottom
  { x: 0, y: -1 }, // up
  { x: 1, y: 1 }, // right-bottom
  { x: 1, y: -1 }, // right-up
  { x: -1, y: 1 }, // left-bottom
  { x: -1, y: -1 }, // left-up
];
