import React from 'react';
import './assets/scss/style.scss';
import './App.scss';
import '@elastic/eui/dist/eui_theme_light.css';
import { EuiProvider } from '@elastic/eui';
import Header from './components/Header';
import FeeCalculator from './components/FeeCalculator';

function App() {
  return (
    <div className="App">
      <EuiProvider colorMode="light">
        <Header />
        <FeeCalculator />
      </EuiProvider>
    </div>
  );
}

export default App;
