import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";
import { FullGame } from "./dom-manipulation.js";

const newGame = new FullGame("Nick");

newGame.createMainScreen();

newGame.playerOne.gameboard.placeShip([1, 4], [2, 2], true); // 4
newGame.playerOne.gameboard.placeShip([6, 6], [3, 7], false); // 5
newGame.playerOne.gameboard.placeShip([2, 4], [5, 5], true); // 3
newGame.playerOne.gameboard.placeShip([8, 8], [7, 8], false); // 2
newGame.playerOne.gameboard.placeShip([2, 4], [8, 8], true); // 3

newGame.playerTwo.gameboard.placeShip([1, 4], [2, 2], true); // 4
newGame.playerTwo.gameboard.placeShip([7, 7], [2, 6], false); // 5
newGame.playerTwo.gameboard.placeShip([2, 4], [5, 5], true); // 3
newGame.playerTwo.gameboard.placeShip([8, 8], [8, 9], false); // 2
newGame.playerTwo.gameboard.placeShip([3, 5], [8, 8], true); // 3

newGame.playerOne.gameboard.receiveAttack(2, 4);
newGame.playerOne.gameboard.receiveAttack(3, 2);

newGame.playerTwo.gameboard.receiveAttack(4, 7);
newGame.playerTwo.gameboard.receiveAttack(7, 4);

newGame.changeTurn();
newGame.changeTurn();
newGame.hitEventListener();

const title = document.querySelector(".title-div");
title.addEventListener("click", () => console.log(newGame));

//need to know which player were placing ship on to style the appropriate board
//perhaps pass the player instance to the game board?
