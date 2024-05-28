import { Gameboard } from "./gameboard.js";

const x = new Gameboard();

x.placeShip([1, 4], [2, 2]);

console.log(x.board);
console.log(x.board[2][2]);
console.log(x.board[2][2].ship);
x.receiveAttack(2, 2);
console.log(x.board[3][2].ship);
