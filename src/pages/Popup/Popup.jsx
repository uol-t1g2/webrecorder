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
  const stopPlayButton = <button className={`Button-style Button-stop`} onClick={playHandler} id="playButton" type="button"><i className='fa-solid fa-stop'></i> Playing</button>;
  const stopRecordButton = <button className={`Button-style Button-stop`} onClick={recordHandler} id="recordButton" type="button"><i className='fa-solid fa-circle-stop'></i> Stop</button>;

  const [buttonRecordActive, setButtonRecordActive] = useState(false);
  const [buttonPlayActive, setButtonPlayActive] = useState(false);


  function recordHandler() {
    if (buttonPlayActive) setButtonPlayActive(false);
    let prev = buttonRecordActive;
    setButtonRecordActive((prev) = !prev);
  }


  function playHandler() {
    if (buttonRecordActive) setButtonRecordActive(false);
    let prev = buttonPlayActive;
    setButtonPlayActive((prev) = !prev);
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
        {buttonRecordActive ? stopRecordButton : recordButton}
        {buttonPlayActive ? stopPlayButton : playButton}
      </div>
    </div>
  );
};

export default Popup;