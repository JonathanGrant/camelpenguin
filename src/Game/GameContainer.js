import React from 'react';

export default class GameContainer {
    constructor(levels, height=800, width=800) {
        this.score = 0;
        this.time = 0;
        this.levels = levels;
        this.currentLevel = 0;
        this.height = height;
        this.width = width;
    }

    getCurrentLevel() {
        return this.levels[this.currentLevel];
    }

    step(stepSize) {
        this.time += stepSize / 1000;
        this.getCurrentLevel().step(stepSize);
        this.score += this.getCurrentLevel().accumulatedScore();
        let accumulatedLevel = this.getCurrentLevel().completed()
        if (accumulatedLevel != 0 && (this.currentLevel + accumulatedLevel >= 0) && (this.currentLevel + accumulatedLevel < this.levels.length)) {
            this.currentLevel += accumulatedLevel;
            this.getCurrentLevel().reset();
        }
    }

    keyDown(e) {
        this.getCurrentLevel().keyDown(e);
    }
    keyUp(e) {
        this.getCurrentLevel().keyUp(e);
    }

    render() { return (
        <div className="game-container"
            style={{
                width: `${this.width}px`,
                height: `${this.height}px`,
                backgroundImage: `url(${this.getCurrentLevel().bg})`,
                backgroundSize: 'cover',
                position: 'relative',
            }}
        >
        <div className="game-score">Time = {this.time.toFixed(4)}, Score = {this.score}</div>
        {this.getCurrentLevel().render()}
        </div>
    )
    }
}
