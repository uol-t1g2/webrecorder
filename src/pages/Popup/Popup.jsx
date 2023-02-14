import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo_light.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import '../../assets/fontawesome/css/fontawesome.min.css';
import '../../assets/fontawesome/css/solid.min.css';

const Popup = () => {
  // Button logic
  const playButton = <button className={`Button-style Button-play`} onClick={playHandler} id="playButton" type="button"><i className='fa-solid fa-circle-play'></i> Play</button>;
  const recordButton = <button className={`Button-style Button-record`} onClick={recordHandler} id="recordButton" type="button"><i className='fa-solid fa-circle-dot'></i> Record</button>;
  const stoppedPlayButton = <button className={`Button-style Button-stop`} onClick={playHandler} id="playButton" type="button"><i className='fa-solid fa-stop'></i> Playing</button>;
  const stoppedRecordButton = <button className={`Button-style Button-stop`} onClick={recordHandler} id="recordButton" type="button"><i className='fa-solid fa-circle-stop'></i> Stop</button>;

  const [buttonRecordActive, setButtonRecordActive] = useState(false);
  const [buttonPlayActive, setButtonPlayActive] = useState(false);


  function recordHandler() {
    if (buttonRecordActive) {
      setButtonRecordActive(false);
    }
    else {
      if (buttonPlayActive) {
        setButtonPlayActive(false);
      }
      setButtonRecordActive(true);
    }
  }

  function playHandler() {
    if (buttonPlayActive) {
      setButtonPlayActive(false);
    }
    else {
      if (buttonRecordActive) {
        setButtonRecordActive(false);
      }
      setButtonPlayActive(true);
    }
  }

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
        {buttonRecordActive || recordButton}
        {buttonRecordActive && stoppedRecordButton}
        {buttonPlayActive || playButton}
        {buttonPlayActive && stoppedPlayButton}
      </div>
    </div>
  );
};

export default Popup;