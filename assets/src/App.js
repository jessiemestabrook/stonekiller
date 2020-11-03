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


var startTime;              // The start time of the entire sequence.
var scheduleAheadTime = 0.1;    // How far ahead to schedule audio (sec)
                            // This is calculated from lookahead, and overlaps
                            // with next interval (in case the timer is late)
let nextNoteTime = 0.0;     // when the next note is due.
var noteResolution = 0;     // 0 == 16th, 1 == 8th, 2 == quarter note
var notesInQueue = [];      // the notes that have been put into the web audio,
                            // and may or may not have played yet. {note, time}

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

  function playBuffer(audioBuffer, time) {
    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);
    source.start(time);
  }

  function nextNote() {
    // Advance current note and time by a 16th note...
    var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
                                          // tempo value to calculate beat length.
    nextNoteTime += secondsPerBeat;    // Add beat length to last beat time

    if (current16thNote == 3) {
        setCurrent16thNote(0);
    } else {
      setCurrent16thNote(current16thNote + 1);
    }
  }

  function scheduleNote( beatNumber, time ) {
    // push the note on the queue, even if we're not playing.
    notesInQueue.push( { note: beatNumber, time: time } );

    if ( (noteResolution==1) && (beatNumber%2))
        return; // we're not playing non-8th 16th notes
    if ( (noteResolution==2) && (beatNumber%4))
        return; // we're not playing non-quarter 8th notes

    // create an oscillator
    if (beatNumber % 4 === 0)    // beat 0 == high pitch
      playBuffer(clickAccentBuffer, time);
    else {
      playBuffer(clickUnaccentBuffer, time);
    }
  }

  function scheduler() {
    // while there are notes that will need to play before the next interval,
    // schedule them and advance the pointer.
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
        scheduleNote( current16thNote, nextNoteTime );
        nextNote();
    }
  }


  // Set up the timer worker, which helps provide stability to the metronome
  timerWorker.onmessage = function(e) {
    if (e.data === "tick") {
        scheduler();
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
            nextNoteTime = audioContext.currentTime;
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
