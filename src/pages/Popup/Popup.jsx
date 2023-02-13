import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo_light.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import '../../assets/fontawesome/css/fontawesome.min.css';
import '../../assets/fontawesome/css/solid.min.css';

const Popup = () => {
  // Button logic
  const [buttonRecordActive, setButtonRecordActive] = useState(false);
  const [buttonPlayActive, setButtonPlayActive] = useState(false);
  const [recordText, setRecordText] = React.useState("Record");
  const [recordIconClass, setRecordIconClass] = React.useState("fa-solid fa-circle-dot");
  const [playText, setPlayText] = React.useState("Play");
  const [playIconClass, setPlayIconClass] = React.useState("fa-solid fa-circle-play");
  const buttonRecordClass = (buttonRecordActive) ? 'Button-stop' : 'Button-record';
  const buttonPlayClass = (buttonPlayActive) ? 'Button-stop' : 'Button-play';

  function recordHandler() {
    if (buttonRecordActive) {
      setRecordText("Record");
      setRecordIconClass("fa-solid fa-circle-dot");
      setButtonRecordActive(false);
    }
    else {
      if (buttonPlayActive) {
        const element = document.querySelector('#playButton') || null;
        if (element) element.click();
      }
      setRecordText("Stop");
      setRecordIconClass("fa-solid fa-circle-stop");
      setButtonRecordActive(true);
    }
  }

  function playHandler() {
    if (buttonPlayActive) {
      setButtonPlayActive(false);
      setPlayText("Play");
      setPlayIconClass("fa-solid fa-circle-play");
    }
    else {
      if (buttonRecordActive) {
        const element = document.querySelector('#recordButton') || null;
        if (element) element.click();
      }
      setButtonPlayActive(true);
      setPlayText("Playing");
      setPlayIconClass("fa-solid fa-stop");
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
        <button className={`Button-style ${buttonRecordClass}`} onClick={recordHandler} id="recordButton" type="button"><i className={recordIconClass}></i> {recordText}</button>
        <button className={`Button-style ${buttonPlayClass}`} onClick={playHandler} id="playButton" type="button"><i className={playIconClass}></i> {playText}</button>
      </div>
    </div>
  );
};

export default Popup;