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

const clickAccentURL = 'https://metronome-audio-bucket.s3.amazonaws.com/click-accent.mp3';
const clickUnaccentURL = 'https://metronome-audio-bucket.s3.amazonaws.com/click-unaccent.mp3'
let clickAccentBuffer, clickUnaccentBuffer;


var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps
                            // with next interval (in case the timer is late)
let nextNoteTime = 0.0;     // when the next note is due.


function formatMilliseconds(ms) {
    return new Date(ms).toISOString().slice(14, -5);
}


function App({audioContext, timerWorker}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState("08:00");
  const [timeStarted, setTimeStarted] = useState(0);
  const [tempo, setTempo] = useState(112);
  const [beatNumber, setBeatNumber] = useState(0);

  timerWorker.onmessage = function(e) {
    if (e.data === "tick") {
        scheduler(tempo);
        const newTimeRemaining = formatMilliseconds(1000*(10 - (audioContext.currentTime - timeStarted)));
        if (newTimeRemaining === "00:00") {
          timerWorker.postMessage("stop");
          setTimeRemaining(newTimeRemaining);
          setHasEnded(true);
        } else if (newTimeRemaining !== timeRemaining) {
          setTimeRemaining(newTimeRemaining);
        }
    } else {
      console.log("message: " + e.data);
    }
  };
  // const [tempo, setTempo] = useState(120);
  useEffect(() =>{
    window.fetch(clickAccentURL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        clickAccentBuffer = audioBuffer;
      });
    window.fetch(clickUnaccentURL)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        clickUnaccentBuffer = audioBuffer;
      });
  }, [audioContext]);
  // const [current16thNote, setCurrent16thNote] = useState(0);
  function nextNote(tempo) {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
                                          // tempo value to calculate beat length.
    nextNoteTime += secondsPerBeat;    // Add beat length to last beat time

    if (beatNumber === 3) {
      setBeatNumber(0);
    } else {
      setBeatNumber(beatNumber + 1);
    }
  }
  function playBuffer(audioBuffer, time) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(time);
  }
  function scheduleNote( beatNumber, time ) {
    if (beatNumber === 0)    // beat 0 == high pitch
      playBuffer(clickAccentBuffer, time);
    else {
      playBuffer(clickUnaccentBuffer, time);
    }
  }

  function scheduler(tempo) {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( beatNumber, nextNoteTime );
        nextNote(tempo);
    }
  }


  return (
    <AppWrapper>
      <InterfaceWrapper>
        <ClockWrapper>{ timeRemaining }</ClockWrapper>
        <BpmWrapper>
          <BpmInput
            type="number"
            value={tempo}
            onChange={e => setTempo(e.target.value)}
            readOnly={isPlaying}
            disabled={isPlaying}
          />
            bpm
          </BpmWrapper>
          <StartButton
            disabled={hasEnded}
            isPlaying={isPlaying}
            onClick={() => {
              if (isPlaying) {
                setIsPlaying(false);
                return timerWorker.postMessage("stop");
              }
              if (timeStarted === 0) {
                audioContext.resume();
                setTimeStarted(audioContext.currentTime);
              }
              setIsPlaying(true);
              nextNoteTime = audioContext.currentTime;
              timerWorker.postMessage("start");
            }}
          >
            {hasEnded && 'nice work'}
            {!hasEnded && isPlaying && 'pause'}
            {!hasEnded && !isPlaying && ((timeStarted > 0) ? 'resume' : 'start')}
          </StartButton>
      </InterfaceWrapper>
    </AppWrapper>
  );
}

export default App;
