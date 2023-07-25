import './App.css';
import React from 'react';

// Import our classes
import { GameObject, AccelerationObject, PlatformerObject, TimeToLiveObject } from './Game/GameObject';


// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=0, stdev=1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function App() {
  const [camel, setCamel] = React.useState(new PlatformerObject(0, 0.005, Math.random()*750, Math.random()*750, 0, 0, '/camel.png', 50, 50, 800, 800));
  const [target, setTarget] = React.useState(new GameObject(Math.random()*750, Math.random()*750, 0, 0, '/target.png', 25, 25, 800, 800));
  const [fireballs, setFireballs] = React.useState([])
  const [stepSize, setStepSize] = React.useState(4);
  const [score, setScore] = React.useState(0);
  const [time, setTime] = React.useState(0);

  const keyDown = (e) => {
    // 32 Space
    // 37 Left
    // 38 Up
    // 39 Right
    // 40 Down
    switch (e.keyCode) {
      case 32:
        setFireballs(oldFireballs => {
          // If not yet passed cooldown, don't shoot
          if (oldFireballs.length > 0 && oldFireballs[oldFireballs.length-1].steps < 50) return oldFireballs
          // Calculate which direction to shoot fireball.
          // If camel is moving, shoot in movement direction
          // Otherwise shoot straight up
          let fDx = camel.dx;
          let fDy = camel.dy;
          if (fDx === 0 && fDy === 0) {
            fDy = -1;
          }
          const newFireball = new TimeToLiveObject(250, camel.x, camel.y, Math.sign(fDx)*1, Math.sign(fDy)*1, '/fireball.png', 20, 20, 800, 800);
          return oldFireballs.concat([newFireball])
        })
        break;
      case 37:
        camel.dx = -1;
        break
      case 39:
        camel.dx = 1;
        break
      case 38:
        camel.jump();
        break
      default:
        break
    }
  };

  const keyUp = (e) => {
    switch (e.keyCode) {
      case 37:
        camel.dx = 0;
        break
      case 39:
        camel.dx = 0;
        break
      default:
        break
    }
  }

  React.useEffect(() => {
    const id = setInterval(() => {
      camel.step(stepSize)

      // Fireball loop
      // Check if any fireballs should dissapear, either through TTL or collision
      setFireballs(oldFireballs => oldFireballs.filter((fireball) => {
        // Check if collided with target
        if (fireball.hasCollision(target)) {
          // Hit! Increase score
          setScore(oldScore => oldScore + 100);
          target.jumpToRandom()
          return null;
        }
        return fireball.step(stepSize);
      }))

      setTime(oldTime => oldTime + stepSize/1000)
    }, 10);

    return () => {
      clearInterval(id);
    };
  }, [stepSize, time])

  React.useEffect(() => {
    console.log("ayo")
    window.addEventListener('keydown', keyDown, false);
    window.addEventListener('keyup', keyUp, false);
  return () => {
      window.removeEventListener('keydown', keyDown, false);
      window.removeEventListener('keyup', keyUp, false);
    }
  }, []);

  return (
    <div className="game-container">
      <div className="game-score">Time = {time.toFixed(4)}, Score = {score}, Gravity = {camel.ddy.toFixed(8)}</div>
      {camel.render()}
      {fireballs.map(f => f.render())}
      {target.render()}
    </div>
  );
}

export default App;
