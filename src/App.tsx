import React from 'react';
import './assets/scss/style.scss';
import './App.scss';
import Header from './components/Header';
import FeeCalculator from './components/FeeCalculator';

function App() {
  return (
    <div className="App">
      <Header />
      <FeeCalculator />
    </div>
  );
}

export default App;
