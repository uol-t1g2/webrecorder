import React, { useState, useEffect } from 'react';
import logo from '../../assets/img/logo_light.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';
import '../../assets/fontawesome/css/fontawesome.min.css';
import '../../assets/fontawesome/css/solid.min.css';

// a function that send messages to the content script
function sendMessage(message) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    // send message to the appropreate browser tab
    chrome.tabs.sendMessage(tabs[0].id, message);
  });
}

// popup page logic
const Popup = () => {

  // Our global event receiver from Content
  chrome.runtime.onMessage.addListener(function (msgObj) {
    console.debug('Got a message from Content,', msgObj);

    // receive messages based on a set of conditions
    switch (msgObj.action) {

      // if the recording was finished
      case 'finishedRecording':
        finishedRecording(msgObj.value);
        break;

      // if the recording finished playing
      case 'finishedPlaying':
        console.log('received finishedPlaying in Popup');
        finishedPlaying(msgObj.value);
        break;

      // otherwise - inform debug console that unknown parameters were received
      default:
        console.debug('Unkown action of', msgObj.action, ' received in Popup');
    }
  });

  // set text content
  const [textContent, setTextContent] = useState('');

  // create play button
  const playButton = (
    <button
      className={`Button-style Button-play`}
      onClick={playHandler}
      id="playButton"
      type="button"
    >
      <i className="fa-solid fa-play"></i> Play
    </button>
  );

  // create record button
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

  // create a play-stop button
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

  // create a record-stop button
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

  // set active states of buttons
  const [buttonRecordActive, setButtonRecordActive] = useState(false);
  const [buttonPlayActive, setButtonPlayActive] = useState(false);

  // a function to switch between record button states
  function toggleRecordButton() {
    // if the play button is pressed during the record state
    // skip record-stop and automatically switch to play
    if (buttonPlayActive) playHandler();
    // toggle button state
    const newButtonState = !buttonRecordActive;
    setButtonRecordActive(newButtonState);
    chrome.storage.session.set({ recordState: newButtonState });
    // output a new button state
    return newButtonState;
  }

  // a function to handle a click on the record button
  function recordHandler() {
    // toggle button state
    const newButtonState = toggleRecordButton();

    if (newButtonState) {
      // if new state is "record"
      sendMessage({
        action: 'startRecording',
        value: 'I want to record events now!',
      });
    } else {

      // if new state is "stop-record"
      sendMessage({
        action: 'stopRecording',
        value: 'I want to stop recording events now!',
      });
    }
  }

  // a function to handle a click on the play button
  function playHandler() {
    // if the record button is pressed during the play state
    // skip play-stop and automatically switch to record
    if (buttonRecordActive) recordHandler();

    // toggle button state
    const newButtonState = !buttonPlayActive;
    setButtonPlayActive(newButtonState);
    chrome.storage.session.set({ playState: newButtonState });

    if (newButtonState) {
      // if new state is "play"
      sendMessage({
        action: 'startPlaying',
        value: 'I want to play events now!',
      });
    } else {
      // if new state is "stop-play"
      sendMessage({
        action: 'stopPlaying',
        value: 'I want to stop play events now!',
      });
    }
  }

  // function to handle the end of playing
  function finishedPlaying(message) {
    if (buttonPlayActive) playHandler();
  }

  // function to handle the end of recording
  function finishedRecording(message) {
    if (buttonRecordActive) toggleRecordButton();
    // display the finishedPlaying message on textarea
    // parse through the recordedEvents objects 
    setTextContent(message);
  }

  useEffect(() => {
    // Maintain the Play and Record button states on popup GUI
    chrome.storage.session.get(['recordState'], (result) => {
      const recordButtonState = result.recordState;
      // if the record button state is undefined
      if (recordButtonState != undefined)
        // return to initial state
        setButtonRecordActive(recordButtonState);
    });
    chrome.storage.session.get(['playState'], (result) => {
      const playButtonState = result.playState;
      // if the play button state is undefined
      if (playButtonState != undefined)
        // return to initial state
        setButtonPlayActive(playButtonState);
    });
  }, []);

  // Generate Popup UI
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
      </header>
      <div className="Content-area">
        <p>press <span class="highlighted">Record</span> to start automating</p>
        <textarea value={textContent} readOnly={true} />
      </div>
      <div className="Button-area">
        {buttonRecordActive ? stopRecordButton : recordButton}
        {buttonPlayActive ? stopPlayButton : playButton}
      </div>
    </div>
  );
};

export default Popup;
