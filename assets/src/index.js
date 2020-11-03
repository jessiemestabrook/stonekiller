import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


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






ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
