import React, { useEffect } from 'react';
import logo from '../../assets/img/WebAutomatorLogo_LightBG.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import '../../assets/fontawesome/css/fontawesome.css';
import '../../assets/fontawesome/css/solid.css';

const Popup = () => {
  useEffect(() => {
    // Listen for messages from the popup.
    console.log('Going to listen to events');
    chrome.runtime.onMessage.addListener((msgObj) => {
      console.log(msgObj);
    });
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
        <button class="Button-style Button-record" type="button"><i class="fa-solid fa-circle-dot"></i> Record</button>
        <button class="Button-style Button-start" type="button"><i class="fa-solid fa-circle-play"></i> Play</button>
        <button class="Button-style Button-stop" type="button"><i class="fa-solid fa-circle-stop"></i> Stop</button>
      </div>
    </div>
  );
};

export default Popup;
