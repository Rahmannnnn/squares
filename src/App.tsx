import { ChangeEvent, useState } from "react";
import "./App.scss";
import { MIN_LENGTH, MODE, MOVE } from "./constants/numbers";
import { Position } from "./interfaces/Position";
import { TrieNode } from "./class/TrieNode";
import { words } from "./data/words";
import { Board } from "./class/Board";

function App() {
  const [mode, setMode] = useState<MODE>(MODE.QUESTION);

  const [row] = useState<number>(MIN_LENGTH);
  const [col] = useState<number>(MIN_LENGTH);

  const [board, setBoard] = useState<string[][]>(
    new Array(row).fill(new Array(col).fill(""))
  );

  const clearBoard = () => {
    setBoard(new Array(row).fill(new Array(col).fill("")));
  };

  const clearAnswer = () => {
    setAnswers(new Set());
  };

  const toggleMode = () => {
    setMode(mode === MODE.QUESTION ? MODE.ANSWER : MODE.QUESTION);
  };

  // Input Handler
  const handleChange = (
    e: ChangeEvent<HTMLInputElement>,
    i: number,
    j: number
  ) => {
    const { value } = e.target;

    let newBoard: string[][] = board.map((r, indexI) => {
      return r.map((val, indexJ) => {
        if (i == indexI && j == indexJ) {
          return value;
        } else {
          return val;
        }
      });
    });

    setBoard(newBoard);
  };

  const [dictionary] = useState<TrieNode>(() => {
    let d = new TrieNode();
    for (let word of words) {
      d.addWord(word);
    }

    return d;
  });

  const isValidDirection = (newPosition: Position, length: number): boolean => {
    const { x, y } = newPosition;
    return x >= 0 && x < length && y >= 0 && y < length;
  };

  const submit = () => {
    findWord();
  };

  const [answers, setAnswers] = useState<Set<string>>(new Set());

  const findWord = () => {
    const b = new Board(board);
    for (let i = 0; i < b.size; i++) {
      for (let j = 0; j < b.size; j++) {
        findWordsRecursive(b, { x: i, y: j }, "", [], dictionary);
      }
    }

    setAnswers(b.answers);
  };

  const findWordsRecursive = (
    board: Board,
    position: Position,
    current: string,
    visited: Position[],
    trie: TrieNode
  ) => {
    const { x, y } = position;
    let newTrie = trie.children.get(board.board[x][y]);
    if (newTrie == null || newTrie == undefined) {
      return;
    }

    let newWord = current + board.board[x][y];
    if (newTrie.eow) {
      board.answers.add(newWord);
    }

    visited.push(position);

    for (let direction of MOVE) {
      const newPosition = {
        x: x + direction.x,
        y: y + direction.y,
      };

      if (isValidDirection(newPosition, board.size)) {
        let index = visited.findIndex(
          (e) => e.x === newPosition.x && e.y === newPosition.y
        );
        if (index === -1) {
          findWordsRecursive(board, newPosition, newWord, visited, newTrie);
        }
      }
    }

    visited.pop();
  };

  const getAnswersLength = (): number[] => {
    let answersArray: string[] = Array.from(answers);
    answersArray.sort((a, b) => a.length - b.length);

    let result: number[] = [];
    let prevWord = "";
    for (let word of answersArray) {
      if (word.length > prevWord.length) {
        result.push(word.length);
      }

      prevWord = word;
    }

    return result;
  };

  return (
    <div className="container">
      <div className="question">
        <h1 className="question__title">Squaredle Solver</h1>
        <div className="question__input">
          {board.map((column, i) => {
            return (
              <div className="question__input__row" key={`row-${i}`}>
                {column.map((value, j) => {
                  return (
                    <div className="question__input__col" key={`col-${j}`}>
                      <input
                        disabled={mode === MODE.ANSWER}
                        type="text"
                        maxLength={1}
                        value={value}
                        onChange={(e) => handleChange(e, i, j)}
                      ></input>
                    </div>
                  );
                })}
              </div>
            );
          })}
          <button
            className={`${
              mode === MODE.QUESTION ? "button__question" : "button__answer"
            }`}
            onClick={() => {
              if (mode === MODE.QUESTION) {
                submit();
              } else {
                clearBoard();
                clearAnswer();
              }

              toggleMode();
            }}
          >
            {mode === MODE.QUESTION ? "SOLVE" : "CLEAR"}
          </button>
        </div>

        <div className="question__action"></div>
      </div>

      {mode === MODE.ANSWER && (
        <div className="answer">
          <h1>Words Found</h1>
          <h2>{Array.from(answers).length}</h2>
          {getAnswersLength().map((wordLength, index) => {
            return (
              <div className="words" key={`word-letter-${index}`}>
                <h1 className="words__title">{wordLength} Letter</h1>
                <div className="words__container">
                  {Array.from(answers)
                    .filter((e) => e.length == wordLength)
                    .map((item, i) => {
                      return (
                        <div
                          className="words__container__item"
                          key={`words-item-${index}-${i}`}
                        >
                          <p>{item}</p>
                        </div>
                      );
                    })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default App;
