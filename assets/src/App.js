import React, { useEffect, useState } from 'react'
import './App.css';
import {
  AppWrapper,
  InterfaceWrapper,
  StartButton,
  ClockWrapper,
  BpmWrapper,
  BpmInput,
} from './components/styled';
// eslint-disable-next-line
import TimerWorker from 'worker-loader!./metronome.worker.js';

const clickAccentURL = 'https://metronome-audio-bucket.s3.amazonaws.com/click-accent.mp3';
const clickUnaccentURL = 'https://metronome-audio-bucket.s3.amazonaws.com/click-unaccent.mp3'



function App() {
  console.log('render app');
  const audioContext = new AudioContext();
  const lookahead = 25.0;
  // App has three overall states -- "begin", "workout", and "done"
  const [appState, setAppState] = useState('start');
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("08:00");
  const [tempo, setTempo] = useState(112);
  const [current16thNote, setCurrent16thNote] = useState(0);
  let clickAccentBuffer, clickUnaccentBuffer;;
  const timerWorker = new TimerWorker();

  function playBuffer(audioBuffer) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start();
  }

  // Set up the timer worker, which helps provide stability to the metronome
  timerWorker.onmessage = function(e) {
    if (e.data === "tick") {
        // scheduler();
    } else {
      console.log("message: " + e.data);
    }
  };
  timerWorker.postMessage({"interval":lookahead});


  useEffect(
    () => {
      // let clickAccentBuffer, clickUnaccentBuffer;

      window.fetch(clickAccentURL)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          // playButton.disabled = false;
          clickAccentBuffer = audioBuffer;
          // playBuffer(clickAccentBuffer);
        });
      window.fetch(clickUnaccentURL)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(audioBuffer => {
          // playButton.disabled = false;
          clickUnaccentBuffer = audioBuffer;
          // playBuffer(clickAccentBuffer);
        });
    },
    [], // just run on mount/unmount
  );

  // const [tempo, setTempo] = useState(120);

  // const [current16thNote, setCurrent16thNote] = useState(0);

  return (
    <AppWrapper>
      <InterfaceWrapper>
        <ClockWrapper>{ timeRemaining }</ClockWrapper>
        <BpmWrapper>
          <BpmInput
            type="number"
            value={tempo}
            onChange={e => setTempo(e.target.value)}
          />
          bpm
        </BpmWrapper>
        <StartButton
          onClick={() => {
            setIsPlaying(true);
            playBuffer(clickAccentBuffer);
            timerWorker.postMessage("start");
          }}
        >
          begin
        </StartButton>
      </InterfaceWrapper>
    </AppWrapper>
  );
}

export default App;
