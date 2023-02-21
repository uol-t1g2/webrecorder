// import object selector to easily fetch DOM elements
import { finder } from '@medv/finder'

// Global recorded events array
var recordedEvents = [];

// Our global event receiver from Popup
chrome.runtime.onMessage.addListener(function (msgObj) {
  console.debug('Got a message from Popup,', msgObj);

  switch (msgObj.action) {
    case 'startRecording':
      console.log('Should start recording here');
      sendMessage({ action: 'test', value: 'Hi from content (recorder)!' });
      // attach global event listeners
      attachGlobalEventListeners();
      break;
    case 'startPlaying':
      console.log('Should start playing recording...');
      sendMessage({ action: 'test', value: 'Hi from content (player)!' });
      break;
    default:
      console.log('Unkown action of', msgObj.action);
  }
});

function sendMessage(message) {
  chrome.runtime.sendMessage(message);
}

// Create a click function for the content page task
// The function receives a selector and triggers the click event on it.
function click(selector) {
  const element = document.querySelector(selector) || null;
  if (element) element.click();
}

// a function that listens to click events and stores them in the recordedEvents array
function attachGlobalEventListeners() {

  // capture all click events
  document.body.addEventListener('click', function (e) {

    // find the best selector for click target (id/class/tag/attr)
    const selector = finder(e.target);

    // store selector in recordedEvents
    recordedEvents.push({
      type: 'click',
      element: selector,
      time: new Date().getTime()
    });

    // test wether the event was added
    console.debug(
      'array length:', recordedEvents.length,
      '\nlast record:', recordedEvents[recordedEvents.length - 1]
    );
  });
}

