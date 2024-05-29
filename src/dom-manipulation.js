import { populateBoard } from "./gameboard";
import { Player } from "./player";

export class FullGame {
  constructor(playerOneName, playerTwoName = "computer") {
    this.playerOne = new Player(this, "real", playerOneName);
    this.playerTwo = new Player(this, "computer");
    this.winner = null;
  }

  changeTurn() {
    if (this.playerOne.gameboard.allSunk()) this.winner = this.playerTwo;
    if (this.playerTwo.gameboard.allSunk()) this.winner = this.playerOne;
  }

  createMainScreen() {
    const playerOneBoard = document.querySelector(".player-one.board");
    const playerTwoBoard = document.querySelector(".player-two.board");
    this.populateBoardDom(playerOneBoard);
    this.populateBoardDom(playerTwoBoard);
  }

  populateBoardDom(board) {
    for (let i = 0; i < 10; i++) {
      const rowDiv = document.createElement("div");
      rowDiv.setAttribute("class", "row");

      for (let j = 0; j < 10; j++) {
        const squareDiv = document.createElement("div");
        squareDiv.setAttribute("class", `row-${i} col-${j} square`);
        rowDiv.appendChild(squareDiv);
      }

      board.appendChild(rowDiv);
    }
  }

  styleShips(row, col) {
    const squareDiv = document.querySelector(`.row-${row}.col-${col}`);
    console.log(squareDiv);
    squareDiv.classList.add("ship");
  }
}
