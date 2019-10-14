import React from 'react';
import './App.css';
import ConnectedBoardPage from './connectors/pages/board';

const App: React.FC = () => {
  return (
    <div className="App">
      <ConnectedBoardPage />
    </div>
  );
};

export default App;
