export class Ship {
  constructor(length) {
    this.length = length;
    this.timesHit = 0;
    this.sunkStatus = false;
  }

  hit() {
    this.timesHit = this.timesHit + 1;

    if (this.timesHit >= this.length) this.sunkStatus = true;
  }

  isSunk() {
    return this.sunkStatus;
  }
}

// module.exports = Ship;
