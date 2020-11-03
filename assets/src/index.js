import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

// eslint-disable-next-line
import TimerWorker from 'worker-loader!./metronome.worker.js';

// First, let's shim the requestAnimationFrame API, with a setTimeout fallback
const requestAnimFrame = (function(){
  return  window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  window.oRequestAnimationFrame ||
  window.msRequestAnimationFrame ||
  function( callback ){
      window.setTimeout(callback, 1000 / 60);
  };
})();





// function play() {
//   if (!unlocked) {
//     // play silent buffer to unlock the audio
//     var buffer = audioContext.createBuffer(1, 1, 22050);
//     var node = audioContext.createBufferSource();
//     node.buffer = buffer;
//     node.start(0);
//     unlocked = true;
//   }

//   isPlaying = !isPlaying;

//   if (isPlaying) { // start playing
//       current16thNote = 0;
//       nextNoteTime = audioContext.currentTime;
//       timerWorker.postMessage("start");
//   } else {
//       timerWorker.postMessage("stop");
//   }
// }





const timerWorker = new TimerWorker();
const audioContext = new AudioContext();

const props = {
  audioContext,
  timerWorker
};
// const clickAccentURL = 'https://metronome-audio-bucket.s3.amazonaws.com/click-accent.mp3';
// const clickUnaccentURL = 'https://metronome-audio-bucket.s3.amazonaws.com/click-unaccent.mp3'
// let clickAccentBuffer, clickUnaccentBuffer;;


// function nextNote() {
//   // Advance current note and time by a 16th note...
//   var secondsPerBeat = 60.0 / tempo;    // Notice this picks up the CURRENT
//                                         // tempo value to calculate beat length.
//   nextNoteTime += secondsPerBeat;    // Add beat length to last beat time

//   if (current16thNote == 3) {
//       setCurrent16thNote(0);
//   } else {
//     setCurrent16thNote(current16thNote + 1);
//   }
// }

// function scheduleNote( beatNumber, time ) {
//   // push the note on the queue, even if we're not playing.
//   notesInQueue.push( { note: beatNumber, time: time } );

//   if ( (noteResolution==1) && (beatNumber%2))
//       return; // we're not playing non-8th 16th notes
//   if ( (noteResolution==2) && (beatNumber%4))
//       return; // we're not playing non-quarter 8th notes

//   // create an oscillator
//   if (beatNumber % 4 === 0)    // beat 0 == high pitch
//     playBuffer(clickAccentBuffer, time);
//   else {
//     playBuffer(clickUnaccentBuffer, time);
//   }
// }

// function scheduler() {
//   // while there are notes that will need to play before the next interval,
//   // schedule them and advance the pointer.
//   while (nextNoteTime < audioContext.currentTime + scheduleAheadTime ) {
//       scheduleNote( current16thNote, nextNoteTime );
//       nextNote();
//   }
// }

// Set up the timer worker, which helps provide stability to the metronome


// function playBuffer(audioBuffer, time) {
//   const source = audioContext.createBufferSource();
//   source.buffer = audioBuffer;
//   source.connect(audioContext.destination);
//   source.start(time);
// }

const lookahead = 25.0;
timerWorker.postMessage({"interval":lookahead});


ReactDOM.render(
  <React.StrictMode>
    <App {...props} />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
