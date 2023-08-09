import './App.css';
import React from 'react';

// Import our classes
import GameContainer from './Game/GameContainer';
import CamelPlatformerGameLevel from './Game/CamelPlatformerGameLevel';
import WinGameLevel from './Game/WinGameLevel';

const areas = [
  [0, 1, 2, 3].map(i => `/images/backgrounds/hobbiton_0${i}.png`),
  [0, 1, 2, 3].map(i => `/images/backgrounds/penguin_0${i}.png`),
  [0, 1, 2, 3].map(i => `/images/backgrounds/koala_0${i}.png`),
]


const levels = [
  new CamelPlatformerGameLevel(0.1, areas[0], areas[0][1]),
  new CamelPlatformerGameLevel(0.3, areas[1], areas[1][1]),
  new CamelPlatformerGameLevel(1.0, areas[2], areas[2][1]),
  new WinGameLevel('/images/backgrounds/winner.jpeg')
];


function App() {
  const [stepSize, setStepSize] = React.useState(1);
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
