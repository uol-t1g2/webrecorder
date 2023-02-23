// Global recorded events array
var recordedEvents = [];

// Our global event receiver from Popup
chrome.runtime.onMessage.addListener(function (msgObj) {
  console.debug('Got a message from Popup,', msgObj);

  switch (msgObj.action) {
    case 'startRecording':
      console.log('Should start recording here');
      sendMessage({ action: 'test', value: 'Hi from content (recorder)!' });
      break;
    case 'startPlaying':
      console.log('Should start playing recording...');
      /* playRecording is only called here for demonstration. 
      It should be removed when required actions are implemented.
      Example: click on the play button on popup window to increment the playground.htm Button counter */
      playRecording(["#counter-button"]);
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
// The function plays a recording when needed
function playRecording(recordedEvents) {
  recordedEvents.forEach(element => {
    click(element);
  });
}
