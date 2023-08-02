import React from 'react';


export default class GameLevelBase {
    // Each child class must implement step and render functions
    constructor(bg) {
        this.bg = bg;
        this.scoreAccumulated = 0;
        this.isCompleted = false;
    }

    step(stepSize) {
        // Child class should overwrite this.
    }

    accumulatedScore() {
        let score = this.scoreAccumulated;
        this.scoreAccumulated = 0;
        return score;
    }

    completed() {
        return this.isCompleted;
    }
}
