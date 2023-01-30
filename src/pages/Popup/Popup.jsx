import React, { useEffect } from 'react';
import logo from '../../assets/img/logo_light.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import '../../assets/fontawesome/css/fontawesome.min.css';
import '../../assets/fontawesome/css/solid.min.css';

const Popup = () => {
  useEffect(() => {
    // Listen for messages from the popup.
    console.log('Going to listen to events');
    chrome.runtime.onMessage.addListener((msgObj) => {
      console.log(msgObj);
    });

    // Button logic to switch on click events
    document.getElementById('recordButton').addEventListener('click', recClick);
    document.getElementById('playButton').addEventListener('click', playClick);

    function recClick() {
      const elRec = document.getElementById('recordButton');
      const elPlay = document.getElementById('playButton');
      if (elRec.classList.contains("Button-record")) {
        if (elPlay.classList.contains("Button-stop")) {
          elPlay.classList.remove("Button-stop");
          elPlay.classList.add("Button-play");
          elPlay.innerHTML = "<i class='fa-solid fa-circle-play'></i> Play";
        }
        elRec.classList.remove("Button-record");
        elRec.classList.add("Button-stop");
        elRec.innerHTML = "<i class='fa-solid fa-circle-dot'></i> Stop";
      }
      else {
        elRec.classList.remove("Button-stop");
        elRec.classList.add("Button-record");
        elRec.innerHTML = "<i class='fa-solid fa-circle-dot'></i> Record";
      }
    }

    function playClick() {
      const elPlay = document.getElementById('playButton');
      const elRec = document.getElementById('recordButton');
      if (elPlay.classList.contains("Button-play")) {
        if (elRec.classList.contains("Button-stop")) {
          elRec.classList.remove("Button-stop");
          elRec.classList.add("Button-record");
          elRec.innerHTML = "<i class='fa-solid fa-circle-dot'></i> Record";
        }
        elPlay.classList.remove("Button-play");
        elPlay.classList.add("Button-stop");
        elPlay.innerHTML = "<i class='fa-solid fa-circle-stop'></i> Stop";
      }
      else {
        elPlay.classList.remove("Button-stop");
        elPlay.classList.add("Button-play");
        elPlay.innerHTML = "<i class='fa-solid fa-circle-play'></i> Play";
      }
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="Content-area">
        <p>Hello UoL class.</p>
        <form>
          <textarea>

          </textarea>
        </form>
      </div>
      <div className="Button-area">
        <button className="Button-style Button-record" id="recordButton" type="button"><i className="fa-solid fa-circle-dot"></i> Record</button>
        <button className="Button-style Button-play" id="playButton" type="button"><i className="fa-solid fa-circle-play"></i> Play</button>
      </div>
    </div>
  );
};

export default Popup;