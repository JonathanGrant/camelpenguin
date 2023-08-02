import './App.css';
import React from 'react';

// Import our classes
import GameContainer from './Game/GameContainer';
import CamelPlatformerGameLevel from './Game/CamelPlatformerGameLevel';


const levels = [
  new CamelPlatformerGameLevel(0.1, '/images/backgrounds/level_00.jpeg'),
  new CamelPlatformerGameLevel(0.3, '/images/backgrounds/level_01.jpeg'),
  new CamelPlatformerGameLevel(1.0, '/images/backgrounds/level_02.jpeg'),
];


function App() {
  const [stepSize, setStepSize] = React.useState(4);
  const [time, setTime] = React.useState(0);
  const [game, setGame] = React.useState(new GameContainer(levels));

  React.useEffect(() => {
    const id = setInterval(() => {
      game.step(stepSize);
      setTime(oldTime => oldTime + stepSize/1000)
    }, 10);

    return () => {
      clearInterval(id);
    };
  }, [stepSize, time, game])

  React.useEffect(() => {
    window.addEventListener('keydown', game.keyDown.bind(game), false);
    window.addEventListener('keyup', game.keyUp.bind(game), false);
  return () => {
      window.removeEventListener('keydown', game.keyDown.bind(game), false);
      window.removeEventListener('keyup', game.keyUp.bind(game), false);
    }
  }, []);

  return (game.render());
}

export default App;
