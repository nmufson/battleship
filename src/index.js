import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { FullGame } from "./dom-manipulation.js";

const enterPlayerName = () => {
  const backgroundDiv = document.createElement("div");
  const nameDiv = document.createElement("div");
  const para = document.createElement("p");
  const input = document.createElement("input");
  const button = document.createElement("button");

  para.textContent = "Enter Player Name:";
  button.textContent = "Enter";

  nameDiv.classList.add("enter-name");
  backgroundDiv.classList.add("name-background");
  input.setAttribute("type", "text");

  nameDiv.appendChild(para);
  nameDiv.appendChild(input);
  nameDiv.appendChild(button);
  document.body.appendChild(backgroundDiv);
  document.body.appendChild(nameDiv);

  button.addEventListener("click", () => {
    const playerName = input.value;

    const newGame = new FullGame(playerName);

    newGame.createMainScreen();
    newGame.populatePlaceShipArea();
    newGame.hitEventListener();

    backgroundDiv.remove();
    nameDiv.remove();
  });
};

// enterPlayerName();

const newGame = new FullGame("Nick");

newGame.createMainScreen();
newGame.populatePlaceShipArea();
newGame.hitEventListener();

// newGame.playerOne.gameboard.placeShip([1, 4], [2, 2], true); // 4
// newGame.playerOne.gameboard.placeShip([6, 6], [3, 7], false); // 5
// newGame.playerOne.gameboard.placeShip([2, 4], [5, 5], true); // 3
// newGame.playerOne.gameboard.placeShip([8, 8], [7, 8], false); // 2
// newGame.playerOne.gameboard.placeShip([2, 4], [8, 8], true); // 3

// newGame.playerTwo.gameboard.placeShip([1, 4], [2, 2], true); // 4
// newGame.playerTwo.gameboard.placeShip([7, 7], [2, 6], false); // 5
// newGame.playerTwo.gameboard.placeShip([2, 4], [5, 5], true); // 3
// newGame.playerTwo.gameboard.placeShip([8, 8], [8, 9], false); // 2
// newGame.playerTwo.gameboard.placeShip([3, 5], [8, 8], true); // 3

const title = document.querySelector(".title-div");
title.addEventListener("click", () =>
  console.log(newGame.playerOne.gameboard.board),
);

//need to know which player were placing ship on to style the appropriate board
//perhaps pass the player instance to the game board?
