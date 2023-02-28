import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo_light.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import '../../assets/fontawesome/css/fontawesome.min.css';
import '../../assets/fontawesome/css/solid.min.css';

function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

const Popup = () => {
  // Button logic
  const playButton = (
    <button
      className={`Button-style Button-play`}
      onClick={playHandler}
      id="playButton"
      type="button"
    >
      <i className="fa-solid fa-circle-play"></i> Play
    </button>
  );
  const recordButton = (
    <button
      className={`Button-style Button-record`}
      onClick={recordHandler}
      id="recordButton"
      type="button"
    >
      <i className="fa-solid fa-circle-dot"></i> Record
    </button>
  );
  const stopPlayButton = (
    <button
      className={`Button-style Button-stop`}
      onClick={playHandler}
      id="playButton"
      type="button"
    >
      <i className="fa-solid fa-stop"></i> Playing
    </button>
  );
  const stopRecordButton = (
    <button
      className={`Button-style Button-stop`}
      onClick={recordHandler}
      id="recordButton"
      type="button"
    >
      <i className="fa-solid fa-circle-stop"></i> Stop
    </button>
  );

  const [buttonRecordActive, setButtonRecordActive] = useState(false);
  const [buttonPlayActive, setButtonPlayActive] = useState(false);

  function recordHandler() {
    if (buttonPlayActive) playHandler();
    const newButtonState = !buttonRecordActive;
    setButtonRecordActive(newButtonState);
    chrome.storage.session.set({ recordState: newButtonState });
    sendMessage({
      action: 'startRecording',
      value: 'I want to record events now!',
    });
    if (newButtonState) {
      sendMessage({
        action: 'startRecording',
        value: 'I want to record events now!',
      });
    }
    else {
      sendMessage({
        action: 'stopRecording',
        value: 'I want to stop recording events now!',
      });
    }
  }

  function playHandler() {
    if (buttonRecordActive) recordHandler();
    const newButtonState = !buttonPlayActive;
    setButtonPlayActive(newButtonState);
    chrome.storage.session.set({ playState: newButtonState });
    if (newButtonState) {
      sendMessage({
        action: 'startPlaying',
        value: 'I want to play events now!',
      });
    }
    else {
      sendMessage({
        action: 'stopPlaying',
        value: 'I want to stop play events now!',
      });
    }
  }

  useEffect(() => {
    // Listen for messages from the popup.
    chrome.runtime.onMessage.addListener((msgObj) => {
      console.debug('Got a message from the page', msgObj);
      return true;
    });

    // Maintain the Play and Record button states on popup GUI
    chrome.storage.session.get(["recordState"], (result) => {
      const recordButtonState = result.recordState;
      if (recordButtonState != undefined) setButtonRecordActive(recordButtonState);
    });
    chrome.storage.session.get(["playState"], (result) => {
      const playButtonState = result.playState;
      if (playButtonState != undefined) setButtonPlayActive(playButtonState);
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
          <textarea></textarea>
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
