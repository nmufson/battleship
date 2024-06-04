import { populateBoard } from "./gameboard";
import { Player } from "./player";

export class FullGame {
  constructor(playerOneName, playerTwoName = "computer") {
    this.playerOne = new Player(this, "real", playerOneName);
    this.playerTwo = new Player(this, "computer");
    this.winner = null;
    this.playerTurn = this.playerOne;
    this.playerOneLegalCoordinates = this.playerOne.gameboard.board;
    this.holdingGhost = false;
  }

  checkWinner() {
    if (this.playerOne.gameboard.allSunk()) this.winner = this.playerTwo;
    if (this.playerTwo.gameboard.allSunk()) this.winner = this.playerOne;

    const gameMessageDiv = document.querySelector(".game-message");
    const gameMessageP = gameMessageDiv.firstElementChild;

    if (this.winner) gameMessageP.textContent = `${this.winner.name} wins!`;
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

  styleShips(row, col, playerName, shipType) {
    const squareDiv = document.querySelector(
      `.row-${row}.col-${col}.${playerName}`,
    );
    squareDiv.classList.add("ship");
    squareDiv.classList.add(shipType);
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

  createShipDom(numberOfSquares) {
    const shipDiv = document.createElement("div");
    for (let i = 0; i < numberOfSquares; i++) {
      const square = document.createElement("div");
      square.classList.add("place-square");
      shipDiv.appendChild(square);
    }

    return shipDiv;
  }

  populatePlaceShipArea() {
    const shipSelectDiv = document.querySelector(".ship-select");

    const carrierDiv = this.createShipDom(5);
    const battleshipDiv = this.createShipDom(4);
    const cruiserDiv = this.createShipDom(3);
    const submarineDiv = this.createShipDom(3);
    const destroyerDiv = this.createShipDom(2);

    carrierDiv.classList.add("carrier", "place-ship");
    battleshipDiv.classList.add("battleship", "place-ship");
    cruiserDiv.classList.add("cruiser", "place-ship");
    submarineDiv.classList.add("submarine", "place-ship");
    destroyerDiv.classList.add("destroyer", "place-ship");

    shipSelectDiv.children[0].classList.add("carrier", "container");
    shipSelectDiv.children[1].classList.add("battleship", "container");
    shipSelectDiv.children[2].classList.add("cruiser", "container");
    shipSelectDiv.children[3].classList.add("submarine", "container");
    shipSelectDiv.children[4].classList.add("destroyer", "container");

    shipSelectDiv.children[0].appendChild(carrierDiv);
    shipSelectDiv.children[1].appendChild(battleshipDiv);
    shipSelectDiv.children[2].appendChild(cruiserDiv);
    shipSelectDiv.children[3].appendChild(submarineDiv);
    shipSelectDiv.children[4].appendChild(destroyerDiv);

    const placeShips = document.querySelectorAll(".place-ship");

    placeShips.forEach((placeShip) => {
      placeShip.addEventListener("click", (e) => this.grabShipFromStart(e));
    });
  }

  grabShipFromStart(e) {
    e.stopPropagation();
    if (this.holdingGhost) return;
    this.holdingGhost = true;

    const selectedShip = e.currentTarget;

    let ghost = selectedShip.cloneNode(true);
    ghost.classList.add("ghost");
    document.body.appendChild(ghost);

    selectedShip.remove();

    this.moveGhost(e);

    this.affectRotateButton();

    document.addEventListener("mousemove", (e) => this.moveGhost(e));
    document.addEventListener("click", (e) => this.placeShip(e));
  }

  affectRotateButton() {
    const checkRotateButton = document.querySelector(".rotate");
    if (checkRotateButton) return checkRotateButton.remove();

    const rotateButton = document.createElement("button");
    rotateButton.textContent = "rotate";
    rotateButton.classList.add("rotate");
    document.body.appendChild(rotateButton);
  }

  moveGhost(e) {
    e.stopPropagation();
    if (!this.holdingGhost) return;
    let ghost = document.querySelector(".ghost");
    if (ghost) {
      ghost.style.left = e.clientX + "px";
      ghost.style.top = e.clientY + "px";
    }
  }

  placeShip(e) {
    e.stopPropagation();
    if (!this.holdingGhost) return;
    this.holdingGhost = false;

    let ghost = document.querySelector(".ghost");

    if (ghost) {
      const shipType = ghost.classList[0];
      if (
        !e.target.classList.contains(this.playerOne.name) ||
        e.target.classList.contains("ship")
      ) {
        return;
      }

      const rowStart = Number(e.target.classList[0][4]);
      const colStart = Number(e.target.classList[1][4]);

      const rowEnd = rowStart + ghost.children.length - 1;
      const colEnd = colStart;

      ghost.remove();
      ghost = null;

      this.playerOne.gameboard.placeShip(
        [rowStart, rowEnd],
        [colStart, colEnd],
        shipType,
      );
      this.addGrabShipFromBoardListeners();
    }

    this.affectRotateButton();
  }

  addGrabShipFromBoardListeners() {
    const shipSquares = document.querySelectorAll(".ship");
    shipSquares.forEach((shipSquare) => {
      shipSquare.addEventListener("click", (e) => this.grabShipFromBoard(e));
    });
  }

  //need to also change the position in the game board object
  grabShipFromBoard(e) {
    e.stopPropagation();
    if (this.holdingGhost) return;
    this.holdingGhost = true;

    if (!e.target.classList.contains("ship")) return;

    const shipType = e.target.classList[5];

    const shipSquares = document.querySelectorAll(`.${shipType}.ship`);
    const length = shipSquares.length;

    const rowStart = Number(e.target.classList[0][4]);
    const colStart = Number(e.target.classList[1][4]);
    const rowEnd = rowStart + length - 1;
    const colEnd = colStart;
    let isVertical = true;
    if (e.target.classList.contains("horizontal")) isVertical = false;

    this.playerOne.gameboard.removeShip(
      [rowStart, rowEnd],
      [colStart, colEnd],
      isVertical,
    );

    const ghost = document.createElement("div");
    ghost.classList.add(shipType, "ghost");

    shipSquares.forEach((shipSquare) => {
      const ghostSquare = document.createElement("div");
      ghostSquare.classList.add("place-square");
      ghost.appendChild(ghostSquare);
      shipSquare.classList.remove("ship");
      shipSquare.classList.remove(shipType);
    });

    document.body.appendChild(ghost);

    this.moveGhost(e);
    document.addEventListener("mousemove", this.moveGhost);

    this.affectRotateButton();

    const rotateButton = document.querySelector(".rotate");
    console.log(rotateButton);

    rotateButton.addEventListener("click", this.rotateShip);
  }

  rotateShip() {
    if (!this.holdingGhost) return;
    const ghost = document.querySelector(".ghost");
    if (ghost.classList.contains("horizontal"))
      return ghost.classList.remove("horizontal");

    ghost.classList.add("horizontal");
  }

  placeShipDom(e, shipType, length) {
    e.stopPropagation();
    if (!e.target.classList.contains(this.playerOne.name)) return;
    console.log(shipType);
    const ghost = document.querySelector(".ghost");
    let isVertical = "true";
    if (ghost.classList.contains("horizontal")) isVertical = false;
    ghost.remove();

    const rowStart = Number(e.target.classList[0][4]);
    const colStart = Number(e.target.classList[1][4]);
    const rowEnd = rowStart + length - 1;
    const colEnd = colStart;

    if (e.target.classList.contains(".ship")) return;

    if (e.target.classList.contains(this.playerOne.name)) {
      this.playerOne.gameboard.placeShip(
        [rowStart, rowEnd],
        [colStart, colEnd],
        shipType,
        isVertical,
      );
      this.dragging = true;
    }
  }
}
