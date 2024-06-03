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

  rotateShipListener() {
    const placeShips = document.querySelectorAll("place-ship");
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

    shipSelectDiv.children[0].appendChild(carrierDiv);
    shipSelectDiv.children[1].appendChild(battleshipDiv);
    shipSelectDiv.children[2].appendChild(cruiserDiv);
    shipSelectDiv.children[3].appendChild(submarineDiv);
    shipSelectDiv.children[4].appendChild(destroyerDiv);

    const placeShips = document.querySelectorAll(".place-ship");

    placeShips.forEach((placeShip) => {
      let ghost = null;
      const shipType = placeShip.classList[0];

      placeShip.addEventListener("mousedown", (e) => {
        ghost = placeShip.cloneNode(true);
        ghost.classList.add("ghost");
        document.body.appendChild(ghost);

        moveGhost(e);

        document.addEventListener("mousemove", moveGhost);
        document.addEventListener("mouseup", onMouseUp);
      });

      function moveGhost(e) {
        if (ghost) {
          ghost.style.left = e.clientX + "px";
          ghost.style.top = e.clientY + "px";
        }
      }

      const onMouseUp = (e) => {
        // Remove the ghost element
        if (ghost) {
          ghost.remove();
          ghost = null;

          const rowStart = Number(e.target.classList[0][4]);
          const colStart = Number(e.target.classList[1][4]);

          const rowEnd = rowStart + placeShip.children.length - 1;
          const colEnd = colStart;

          if (e.target.classList.contains(this.playerOne.name)) {
            this.playerOne.gameboard.placeShip(
              [rowStart, rowEnd],
              [colStart, colEnd],
              shipType,
            );
            this.addSelectShipListeners();
            placeShip.remove();
          }
        }
        document.removeEventListener("mousemove", moveGhost);
        document.removeEventListener("mouseup", onMouseUp);
      };
    });
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

  addSelectShipListeners() {
    const shipSquares = document.querySelectorAll(".ship");
    console.log(shipSquares);
    shipSquares.forEach((shipSquare) => {
      shipSquare.addEventListener("click", (e) => this.selectPlacedShip(e));
    });
  }

  selectPlacedShip(e) {
    // const selectedShipSquares = document.querySelectorAll(".selected");
    // if (selectedShipSquares) {
    //   selectedShipSquares.forEach((square) =>
    //     square.classList.remove("selected"),
    //   );
    // }

    const shipType = e.target.classList[5];

    const shipSquares = document.querySelectorAll(`.${shipType}`);

    const movingShip = document.createElement("div");
    movingShip.classList.add("moving-ship");

    shipSquares.forEach((shipSquare) => {
      const movingShipSquare = document.createElement("div");
      movingShip.appendChild(movingShipSquare);
      shipSquare.classList.remove("ship");
    });

    document.body.appendChild(movingShip);

    this.moveShip(e, movingShip);
    document.addEventListener("mousemove", (e) => this.moveShip(e, movingShip));

    //add listener to allow placing the ship, may need to move onMouseUp out of
    //the function and make it a method
    // movingShip.addEventListener("click"

    const rotateButton = document.createElement("button");
    rotateButton.textContent = "rotate";
    rotateButton.classList.add("rotate");
    document.body.appendChild(rotateButton);
  }

  moveShip(e, movingShip) {
    if (movingShip) {
      movingShip.style.left = e.clientX + "px";
      movingShip.style.top = e.clientY + "px";
    }
  }

  rotateShip() {}
}
