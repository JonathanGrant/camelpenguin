import React from 'react';

import GameLevelBase from "./GameLevel";
import {
  GameObject,
  AccelerationObject,
  PlatformerObject,
  TimeToLiveObject,
} from "./GameObject";

export default class CamelPlatformerGameLevel extends GameLevelBase {
  constructor(tgtSpeed=0, ...args) {
    super(...args);

    // TODO: Propagate height and width or replace everything with percents
    this.fireballs = [];
    this.camel = new PlatformerObject(
        0, 0.005, Math.random() * 750, Math.random() * 750, 0, 0, "/camel.png", 50, 50, 800, 800,
    );
    this.target = new GameObject(
      Math.random() * 750, Math.random() * 750, tgtSpeed, tgtSpeed, "/target.png", 25, 25, 800, 800,
    );
    this.hits = 0;
  }

  step(stepSize) {
    this.camel.step(stepSize);
    this.target.step(stepSize);
    // Fireball loop
    // Check if any fireballs should dissapear, either through TTL or collision
    this.fireballs = this.fireballs.filter((fireball) => {
      // Check if collided with target
      if (fireball.hasCollision(this.target)) {
        // Hit! Increase score
        this.scoreAccumulated += 10 * Math.abs(this.target.dx);
        this.hits += 1;
        if (this.hits >= 3) this.isCompleted = true;
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
        250, this.camel.x, this.camel.y, Math.sign(fDx) * 1, Math.sign(fDy) * 1, "/fireball.png", 20, 20, 800, 800,
    );
    this.fireballs.push(newFireball);
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
            {this.camel.render()}
            {this.target.render()}
            {this.fireballs.map(f => f.render())}
        </React.Fragment>
    )
  }
}
