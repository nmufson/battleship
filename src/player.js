import { Gameboard } from "./gameboard";

export class Player {
  constructor(gameInstance, playerType, name = "computer") {
    this.playerType = playerType;
    this.name = name;
    this.gameboard = new Gameboard(this, gameInstance);
    this.winStatus = null;
  }
}
