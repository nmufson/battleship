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
newGame.playerTwo.gameboard.placeShip([6, 6], [3, 7], false); // 5
newGame.playerTwo.gameboard.placeShip([2, 4], [5, 5], true); // 3
newGame.playerTwo.gameboard.placeShip([8, 8], [7, 8], false); // 2
newGame.playerTwo.gameboard.placeShip([2, 4], [8, 8], true); // 3

//need to know which player were placing ship on to style the appropriate board
//perhaps pass the player instance to the game board?
