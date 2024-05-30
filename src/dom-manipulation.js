import { populateBoard } from "./gameboard";
import { Player } from "./player";

export class FullGame {
  constructor(playerOneName, playerTwoName = "computer") {
    this.playerOne = new Player(this, "real", playerOneName);
    this.playerTwo = new Player(this, "computer");
    this.winner = null;
    this.playerTurn = this.playerOne;
    this.playerOneLegalCoordinates = this.playerOne.gameboard.board;
  }

  checkWinner() {
    if (this.playerOne.gameboard.allSunk()) this.winner = this.playerTwo;
    if (this.playerTwo.gameboard.allSunk()) this.winner = this.playerOne;
  }

  createMainScreen() {
    const middleLeftDiv = document.querySelector(".middle-left-div");
    const middleRightDiv = document.querySelector(".middle-right-div");
    const playerOneBoard = middleLeftDiv.firstElementChild;
    const playerTwoBoard = middleRightDiv.firstElementChild;

    playerOneBoard.classList.add(this.playerOne.name);
    playerTwoBoard.classList.add(this.playerTwo.name);

    this.populateBoardDom(playerOneBoard, this.playerOne.name);
    this.populateBoardDom(playerTwoBoard, this.playerTwo.name);
  }

  populateBoardDom(board, playerName) {
    for (let i = 0; i < 10; i++) {
      const rowDiv = document.createElement("div");
      rowDiv.setAttribute("class", "row");

      for (let j = 0; j < 10; j++) {
        const squareDiv = document.createElement("div");
        squareDiv.setAttribute(
          "class",
          `row-${i} col-${j} square ${playerName}`,
        );
        rowDiv.appendChild(squareDiv);
      }

      board.appendChild(rowDiv);
    }
  }

  styleShips(row, col, playerName) {
    const squareDiv = document.querySelector(
      `.row-${row}.col-${col}.${playerName}`,
    );
    squareDiv.classList.add("ship");
  }

  changeTurn() {
    const gameMessageDiv = document.querySelector(".game-message");
    const gameMessageP = gameMessageDiv.firstElementChild;
    if (this.playerTurn.name === this.playerOne.name) {
      this.playerTurn = this.playerTwo;
      gameMessageP.textContent = `${this.playerTwo.name}'s turn`;
    } else {
      this.playerTurn = this.playerOne;
      gameMessageP.textContent = `${this.playerOne.name}'s turn`;
    }
  }

  hitEventListener() {
    const boards = document.querySelectorAll(".board");
    boards.forEach((board) => {
      board.addEventListener("click", (event) => {
        this.checkWinner();
        if (this.winner !== null) return;
        if (event.currentTarget.classList.contains(this.playerTurn.name)) {
          return;
        }
        if (event.target.classList.contains("hit")) {
          return;
        }

        const squareDiv = event.target;
        const classArray = Array.from(squareDiv.classList);
        const row = classArray[0][4];
        const col = classArray[1][4];
        console.log(row);
        console.log(col);

        if (this.playerTurn === this.playerOne) {
          this.playerTwo.gameboard.receiveAttack(row, col);
        } else {
          this.playerOne.gameboard.receiveAttack(row, col);
        }

        this.computerTurn();
      });
    });
  }

  computerTurn() {
    this.checkWinner();
    if (this.winner !== null) return;

    const userBoard = document.querySelector(`.board.${this.playerOne.name}`);
    const rowArray = Array.from(userBoard.children);
    const filteredRowArray = rowArray.filter(
      (row) => !row.classList.contains("all-hit"),
    );
    const filteredRowLength = filteredRowArray.length;
    const chosenRow =
      filteredRowArray[Math.floor(Math.random() * filteredRowLength)];

    const squareArray = Array.from(chosenRow.children);
    const filteredSquareArray = squareArray.filter(
      (square) => !square.classList.contains("hit"),
    );
    const filteredSquareLength = filteredSquareArray.length;
    const chosenSquare =
      filteredSquareArray[Math.floor(Math.random() * filteredSquareLength)];

    const rowNumber = rowArray.indexOf(chosenRow);
    const colNumber = squareArray.indexOf(chosenSquare);

    this.playerOne.gameboard.receiveAttack(rowNumber, colNumber);
  }
}
