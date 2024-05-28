import { Gameboard } from "./gameboard.js";
import { Ship } from "./ship.js";

test("return ship object containing length, number of times hit, and where theyre sunk or not", () => {
  expect(new Ship(4)).toEqual({
    length: 4,
    timesHit: 0,
    sunkStatus: false,
  });
  expect(new Ship(2)).toEqual({
    length: 2,
    timesHit: 0,
    sunkStatus: false,
  });
});

test("check that hit method incremenets timesHit", () => {
  const shipOne = new Ship(3);
  expect(shipOne.timesHit).toBe(0);
  shipOne.hit();
  expect(shipOne.timesHit).toBe(1);
  shipOne.hit();
  expect(shipOne.timesHit).toBe(2);
});

test("isSunk should check if ship has been hit as many times as length", () => {
  const shipOne = new Ship(4);
  expect(shipOne.isSunk()).toBe(false);
  shipOne.hit();
  expect(shipOne.isSunk()).toBe(false);
  shipOne.hit();
  expect(shipOne.isSunk()).toBe(false);
  shipOne.hit();
  expect(shipOne.isSunk()).toBe(false);
  shipOne.hit();
  expect(shipOne.isSunk()).toBe(true);
});

test("check gameboard coordinates exist", () => {
  const gameboardOne = new Gameboard();
  expect(gameboardOne.board[0]).toBeTruthy();
  expect(gameboardOne.board[0][0]).toBeTruthy();
  expect(gameboardOne.board[9][9]).toBeTruthy();
  expect(gameboardOne.board[10]).toBeUndefined();
  expect(gameboardOne.board[9][10]).toBeUndefined();
});

test("place ship at coordinate", () => {
  const gameboardOne = new Gameboard();
  //first arr is rows populated, second arr is columns (so row 1 to 4 in column 2)
  gameboardOne.placeShip([1, 4], [2, 2], true);
  //[row] -> [column] -> {hitStatus: true/false, ship: none/instance}
  //most inner array contains a 0 if not hit, 1 if hit, as well as ship obj instance if
  //one exists there
  expect(gameboardOne.board[1][2].ship).toBeInstanceOf(Ship);
  expect(gameboardOne.board[3][2].ship).toBeInstanceOf(Ship);
  expect(gameboardOne.board[4][2].ship).toBeInstanceOf(Ship);
  expect(gameboardOne.board[5][2].ship).toBe("none");
  expect(gameboardOne.board[4][3].ship).toBe("none");
  expect(gameboardOne.board[4][2].hitStatus).toBe(false);
  expect(gameboardOne.board[5][2].ship).toBe("none");
  expect(gameboardOne.board[0][2].ship).toBe("none");
  expect(gameboardOne.board[0][0].ship).toBe("none");
});

test("receives attacks marks coordinate hit and if there is a ship, registers a hit on that ship", () => {
  const gameboardOne = new Gameboard();
  gameboardOne.placeShip([1, 4], [2, 2], true);
  gameboardOne.receiveAttack(5, 2);
  gameboardOne.receiveAttack(3, 3);
  expect(gameboardOne.board[3][2].ship.isSunk()).toBe(false);
  expect(gameboardOne.board[3][2].ship.timesHit).toBe(0);
  expect(gameboardOne.board[5][2].hitStatus).toBe(true);
  expect(gameboardOne.board[3][3].hitStatus).toBe(true);
  expect(gameboardOne.board[5][1].hitStatus).toBe(false);
  gameboardOne.receiveAttack(2, 2);
  expect(gameboardOne.board[2][2].ship.timesHit).toBe(1);
  expect(gameboardOne.board[3][2].ship.timesHit).toBe(1);
  expect(gameboardOne.board[2][2].ship.timesHit).toBe(1);
  gameboardOne.receiveAttack(4, 2);
  expect(gameboardOne.board[2][2].ship.timesHit).toBe(2);
  expect(gameboardOne.board[1][2].ship.timesHit).toBe(2);
  expect(gameboardOne.board[4][2].hitStatus).toBe(true);
  gameboardOne.receiveAttack(6, 2);
  gameboardOne.receiveAttack(3, 0);
  expect(gameboardOne.board[6][2].hitStatus).toBe(true);
  expect(gameboardOne.board[3][0].hitStatus).toBe(true);
  expect(gameboardOne.board[6][2].ship).toBe("none");

  gameboardOne.receiveAttack(1, 2);
  expect(gameboardOne.board[1][2].ship.timesHit).toBe(3);
  expect(gameboardOne.board[3][2].ship.isSunk()).toBe(false);
  gameboardOne.receiveAttack(3, 2);
  expect(gameboardOne.board[3][2].ship.isSunk()).toBe(true);
  expect(gameboardOne.board[1][2].ship.timesHit).toBe(4);
});

test("check if all ships on gameboard are sunk", () => {
  const gameboardOne = new Gameboard();
  gameboardOne.placeShip([3, 5], [1, 1], true);
  gameboardOne.placeShip([7, 7], [2, 6], false);
  gameboardOne.receiveAttack(3, 1);
  gameboardOne.receiveAttack(4, 1);
  expect(gameboardOne.board[3][1].ship.isSunk()).toBe(false);
  gameboardOne.receiveAttack(5, 1);
  expect(gameboardOne.board[3][1].ship.isSunk()).toBe(true);

  gameboardOne.receiveAttack(7, 2);
  gameboardOne.receiveAttack(7, 3);
  gameboardOne.receiveAttack(7, 4);
  gameboardOne.receiveAttack(7, 5);
  expect(gameboardOne.board[7][3].ship.isSunk()).toBe(false);
  expect(gameboardOne.allSunk()).toBe(false);
  gameboardOne.receiveAttack(7, 6);
  expect(gameboardOne.board[7][3].ship.isSunk()).toBe(true);

  expect(gameboardOne.allSunk()).toBe(true);
});

test("check real and computer player instance (should have gameboard and win status", () => {
  const playerOne = new Player("Nick");
  const computerPlayer = new Player();

  expect(playerOne.winStatus).toBe(false);
  expect(playerOne.winStatus).toBe(false);

  expect(playerOne.gameboard).toEqual(gameboard);
});
