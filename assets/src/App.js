import React, { useState } from 'react'
import './App.css';

function App() {

  // App has three overall states -- "begin", "workout", and "done"
  const [appState, setAppState] = useState('start');
  const [isPlaying, setIsPlaying] = useState(false);

  // const [tempo, setTempo] = useState(120);

  // const [current16thNote, setCurrent16thNote] = useState(0);

  return (
    <div className="App">
      <header className="App-header">
        <h2>Ready to Practice</h2>
        <button
          style={{
            padding: '20px',
            fontSize: '2rem',
            borderRadius: '23px'
          }}

          onClick={() => {
            if (isPlaying) { setAppState("playing"); }
            else { setAppState("playing")}
          }}
        >{isPlaying ? "stop" : "start"}</button>
      </header>
    </div>
  );
}

export default App;
