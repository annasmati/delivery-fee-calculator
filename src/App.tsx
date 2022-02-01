import React from 'react';
import './assets/scss/style.scss';

import background from './assets/images/background.png';
import Header from './components/Header';
import FeeCalculator from './components/FeeCalculator';

const css = `
.App{
  width: 100wh;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  background-image: url("${background}");
  background-position: center;
  background-size: cover;
  background-repeat:no-repeat; 
}
`;

function App() {
  return (
    <div className="App">
      <style>{css}</style>
      <Header />
    </div>
  );
}

export default App;
