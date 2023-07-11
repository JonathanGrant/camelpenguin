import './App.css';
import React from 'react';

// Standard Normal variate using Box-Muller transform.
function gaussianRandom(mean=0, stdev=1) {
  const u = 1 - Math.random(); // Converting [0,1) to (0,1]
  const v = Math.random();
  const z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
  // Transform to the desired mean and standard deviation:
  return z * stdev + mean;
}

function App() {

  const [x, setX] = React.useState(parseInt(Math.random()*750));
  const [y, setY] = React.useState(parseInt(Math.random()*750));
  const [stepSize, setStepSize] = React.useState(1);
  const [dx, setDX] = React.useState(1);
  const [dy, setDY] = React.useState(1);

  const [score, setScore] = React.useState(0);

  // Create refs for x and y
  const xRef = React.useRef(x);
  const yRef = React.useRef(y);
  const dxRef = React.useRef(dx);
  const dyRef = React.useRef(dy);

  React.useEffect(() => {
    // Update the refs each time x and y change
    xRef.current = x;
    yRef.current = y;
    dxRef.current = dx;
    dyRef.current = dy;
  }, [x, y, dx, dy]);

  React.useEffect(() => {
    const id = setInterval(() => {
      if (xRef.current <= 0)   setDX(1);
      if (xRef.current >= 800 - 50) setDX(-1);
      if (yRef.current <= 0)   setDY(1);
      if (yRef.current >= 800 - 50) setDY(-1);

      setX( prevX => prevX + dxRef.current * stepSize + gaussianRandom()*stepSize );
      setY( prevY => prevY + dyRef.current * stepSize + gaussianRandom()*stepSize );
    }, 10);

    return () => {
      clearInterval(id);
    };
  }, [stepSize])

  return (
    <div className="game-container"
    onClick={() => setScore(s => s-1)}
    >
      <div className="game-score">{score}</div>
      <img 
        alt="camel"
        src="/camel.png"
        style={{
          position: 'absolute',
          left: x,
          top: y,
          width: '50px',
          height: '50px',
        }}
        onClick={() => {setScore(s => s+11); setStepSize(s => s+0.1)}}
      />
    </div>
  );
}

export default App;
