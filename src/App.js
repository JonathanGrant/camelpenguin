import './App.css';
import React from 'react';

// Import our classes
import { GameObject, AccelerationObject } from './Game/GameObject';


// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=0, stdev=1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function App() {
  const [camel, setCamel] = React.useState(new AccelerationObject(0, 0, Math.random()*750, Math.random()*750, 0, 0, '/camel.png', 50, 50, 800, 800));
  const [stepSize, setStepSize] = React.useState(1);
  const [score, setScore] = React.useState(0);
  const [time, setTime] = React.useState(0);

  const keyDown = (e) => {
    // 37 Left
    // 38 Up
    // 39 Right
    // 40 Down
    switch (e.keyCode) {
      case 37:
        camel.dx = -1;
        break
      case 38:
        camel.dy = -1;
        break
      case 39:
        camel.dx = 1;
        break
      case 40:
        camel.dy = 1;
        break
      case 32:
        camel.ddy += gaussianRandom(0, 0.01)
        break
      default:
        console.log("Other key pressed: ", e.keyCode);
        break
    }
    console.log(camel)
  };

  React.useEffect(() => {
    const id = setInterval(() => {
      camel.step(stepSize)
      setTime(oldTime => oldTime + stepSize/1000)
    }, 10);

    return () => {
      clearInterval(id);
    };
  }, [stepSize])

  React.useEffect(() => {
    window.addEventListener('keydown', keyDown, false);
  return () => window.removeEventListener('keydown', keyDown, false);
  }, []);

  return (
    <div className="game-container"
    onClick={() => setScore(s => s-1)}
    >
      <div className="game-score">Time = {time.toFixed(4)}, Score = {score}, Gravity = {camel.ddy.toFixed(8)}</div>
      {camel.render({onClick: () => {setScore(s => s+11); setStepSize(s => s+0.1)}})}
    </div>
  );
}

export default App;
