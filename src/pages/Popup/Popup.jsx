import React, { useEffect } from 'react';
import logo from '../../assets/img/WebAutomatorLogo_LightBG.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

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
        <p>Hello UoL class.</p>
        <form>
          <textarea>

          </textarea>
        </form>
      </header>
    </div>
  );
};

export default Popup;
