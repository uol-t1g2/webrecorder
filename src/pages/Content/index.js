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
    if(element.type == "click") {
      document.querySelector(element.selector).click();
    }
  });
}