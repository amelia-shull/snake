import React,  { useState } from 'react';
import Login from './components/login';
import Game from './components/game';

function App() {
  const [view, setView] = useState('login');
  return (
    <div className="bg-secondary">
      {view === 'login' && (<Login setView={setView}></Login>)}
      {view === 'game' && (<Game></Game>)}
    </div>
  );
}

export default App;
