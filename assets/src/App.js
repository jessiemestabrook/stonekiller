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


var startTime;              // The start time of the entire sequence.
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps
                            // with next interval (in case the timer is late)
let nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}

function formatMilliseconds(ms) {
    return new Date(ms).toISOString().slice(14, -5);
}


function App({audioContext, timerWorker}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("08:00");
  const [timeStarted, setTimeStarted] = useState(0);
  const [tempo, setTempo] = useState(112);
  const [beatNumber, setBeatNumber] = useState(1);

  timerWorker.onmessage = function(e) {
    if (e.data === "tick") {
        // scheduler();
        setTimeRemaining(formatMilliseconds(1000*(480 - (audioContext.currentTime - timeStarted))));
    } else {
      console.log("message: " + e.data);
    }
  };
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
            isPlaying={isPlaying}
            disabled={isPlaying}
            onClick={() => {
              setIsPlaying(true);
              audioContext.resume();
              nextNoteTime = audioContext.currentTime;
              console.log('nextNoteTime is', nextNoteTime);
              setTimeStarted(audioContext.currentTime);
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
