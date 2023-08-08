import React from 'react';

import GameLevelBase from "./GameLevel";
import {
  GameObject,
  AccelerationObject,
  PlatformerObject,
  TimeToLiveObject,
} from "./GameObject";

export default class CamelPlatformerGameLevel extends GameLevelBase {
  constructor(tgtSpeed=0, areas=[], ...args) {
    super(...args);

    // Lets make areas modify the bg image instead of a new bg image per area
    this.areas = areas;
    this.currentArea = parseInt(this.areas.length / 2);
    this.bg = this.getCurrentArea();
    this.tgtSpeed = tgtSpeed;
    this.reset()
  }

  reset() {
    super.reset()
    this.fireballs = [];
    this.blackholes = [];
    this.camel = new PlatformerObject(
        0, 0.03, null, null, 0, 0, "/camel.png", 5, 5,
    );
    this.target = new GameObject(
      null, null, this.tgtSpeed, this.tgtSpeed, "/target.png", 2.5, 2.5,
    );
    this.tgtHits = 0;
    this.selfHits = 0;
  }

  getCurrentArea() {
    return this.areas[this.currentArea];
  }

  changeArea(areaChange) {
    if ((areaChange != 0) && (this.currentArea + areaChange >= 0) && (this.currentArea + areaChange < this.areas.length)) {
      this.currentArea += areaChange;
      if (areaChange < 0) {
        this.camel.x = this.camel.xBorder - this.camel.xSize - 1;
      } else {
        this.camel.x = 1;
      }
      this.bg = this.getCurrentArea()
    }
  }

  step(stepSize) {
    this.camel.step(stepSize);
    this.changeArea(this.camel.areaChange());
    this.target.step(stepSize);
    this.blackholeSteps(stepSize);
    // Fireball loop
    // Check if any fireballs should dissapear, either through TTL or collision
    this.fireballs = this.fireballs.filter((fireball) => {
      // Check if collided with target
      if (fireball.hasCollision(this.target)) {
        // Hit! Increase score
        this.scoreAccumulated += 10 * Math.abs(this.target.dx);
        this.tgtHits += 1;
        if (this.tgtHits >= 3) this.levelAccumulation = 1;
        this.target.jumpToRandom();
        return null;
      }
      return fireball.step(stepSize);
    });
  }

  shootFireball() {
    // If not yet passed cooldown, don't shoot
    if (
        this.fireballs.length > 0 &&
        this.fireballs[this.fireballs.length - 1].steps < 50
    )
        return;
    // Calculate which direction to shoot fireball.
    // If camel is moving, shoot in movement direction
    // Otherwise shoot straight up
    let fDx = this.camel.dx;
    let fDy = this.camel.dy;
    if (fDx === 0 && fDy === 0) {
        fDy = -1;
    }
    const newFireball = new TimeToLiveObject(
        250, this.camel.x, this.camel.y, Math.sign(fDx) * 1, Math.sign(fDy) * 1, "/fireball.png", 2, 2,
    );
    this.fireballs.push(newFireball);
  }

  blackholeSteps(stepSize) {
    this.blackholes = this.blackholes.filter((bhole) => {
      // Check if collided with player
      if (bhole.hasCollision(this.camel)) {
        // Hit! Decrease score
        this.scoreAccumulated -= 10 * Math.abs(this.target.dx);
        this.selfHits += 1;
        if (this.selfHits >= 3) this.levelAccumulation = -1;
        return null;
      }
      return bhole.step(stepSize);
    });
    let bholeSteps = 200;
    let bholeSpeed = 0.5;
    if (this.blackholes.length > 0 && this.blackholes[this.blackholes.length - 1].steps < bholeSteps) return;
    // Recreate blackholes
    let directions = [[0, 1], [0, -1], [1, 1], [1, -1], [-1, 1], [-1, -1], [-1, 0], [1, 0]]
    this.blackholes = directions.map(dxy => new TimeToLiveObject(
      bholeSteps, this.target.x, this.target.y, bholeSpeed*dxy[0], bholeSpeed*dxy[1], "/blackhole.png", 2, 2,
    ))
  }

  keyDown(e) {
    // 32 Space
    // 37 Left
    // 38 Up
    // 39 Right
    // 40 Down
    switch (e.keyCode) {
      case 32:
        this.shootFireball();
        break;
      case 37:
        this.camel.dx = -1;
        break;
      case 39:
        this.camel.dx = 1;
        break;
      case 38:
        this.camel.jump();
        break;
      default:
        break;
    }
  }

  keyUp(e) {
    switch (e.keyCode) {
      case 37:
        this.camel.dx = 0;
        break;
      case 39:
        this.camel.dx = 0;
        break;
      default:
        break;
    }
  }

  render() {
    return (
        <React.Fragment>
            {/* {this.areas[this.currentArea].render()} */}
            {this.camel.render()}
            {this.target.render()}
            {this.fireballs.map(f => f.render())}
            {this.blackholes.map(f => f.render())}
        </React.Fragment>
    )
  }
}
