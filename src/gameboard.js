import { Ship } from "./ship";

export class Gameboard {
  constructor() {
    this.board = populateBoard();
    this.allSunkStatus = false;
    this.numberOfShips = 0;
    this.numberOfSunkenShips = 0;
  }

  placeShip(rowSpaces, colSpaces, isVertical = true) {
    this.numberOfShips = this.numberOfShips + 1;
    const length =
      1 +
      Math.max(...[rowSpaces[1] - rowSpaces[0], colSpaces[1] - colSpaces[0]]);

    const ship = new Ship(length);
    const startColumn = colSpaces[0];
    const startRow = rowSpaces[0];

    if (this.checkForShip(rowSpaces, colSpaces, isVertical) === true) return;

    if (isVertical) {
      for (let i = startRow; i < length + startRow; i++) {
        this.board[i][startColumn].ship = ship;
      }
    } else {
      for (let i = startColumn; i < length + startColumn; i++) {
        this.board[startRow][i].ship = ship;
      }
    }
  }

  checkForShip(rowSpaces, colSpaces, isVertical) {
    const spaceOccupied = false;
    const startColumn = colSpaces[0];
    const startRow = rowSpaces[0];
    const length =
      1 +
      Math.max(...[rowSpaces[1] - rowSpaces[0], colSpaces[1] - colSpaces[0]]);

    if (isVertical) {
      for (let i = startRow; i < length + startRow; i++) {
        if (isObject(this.board[i][startColumn].ship)) spaceOccupied = true;
      }
    } else {
      for (let i = startColumn; i < length + startColumn; i++) {
        if (isObject(this.board[startRow][i].ship)) spaceOccupied = true;
      }
    }
    return spaceOccupied;
  }

  receiveAttack(row, col) {
    //first check if coordinate pair already hit/attacked
    if (this.board[row][col].hitStatus === true) return;
    //change hit status to true and increment ship hits
    this.board[row][col].hitStatus = true;
    if (isObject(this.board[row][col].ship)) {
      this.board[row][col].ship.hit();
      if (
        this.board[row][col].ship.length === this.board[row][col].ship.timesHit
      ) {
        this.board[row][col].ship.sunkStatus = true;
        this.numberOfSunkenShips = this.numberOfSunkenShips + 1;
      }
    }

    if (this.numberOfSunkenShips === this.numberOfShips)
      this.allSunkStatus = true;
  }

  allSunk() {
    return this.allSunkStatus;
  }
}

//check if value is object
//typeof null returns 'object' so we need to make sure our value is also not null
const isObject = (value) => {
  return value !== null && typeof value === "object";
};

export const populateBoard = () => {
  const arr = [];
  for (let i = 0; i < 10; i++) {
    arr.push([]);
  }

  arr.forEach((row) => {
    for (let i = 0; i < 10; i++) {
      row.push({ hitStatus: false, ship: "none" });
    }
  });

  return arr;
};

// module.exports = Gameboard;
