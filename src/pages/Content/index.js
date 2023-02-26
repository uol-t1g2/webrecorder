// Global recorded events array
let recordedEvents = ["#counter-button", "#counter-button", "#counter-button"];

// Our global event receiver from Popup
chrome.runtime.onMessage.addListener(function (msgObj) {
  console.debug('Got a message from Popup,', msgObj);

  switch (msgObj.action) {
    case 'startRecording':
      console.log('Should start recording here');
      sendMessage({ action: 'test', value: 'Hi from content (recorder)!' });
      break;
    case 'startPlaying':
      console.log('Should start playing recording...', recordedEvents.length);
      playRecording(recordedEvents);
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
  let intervalId = setInterval(() => {
    if (document.readyState === 'complete') {
      for (const element of recordedEvents) {
        const elem = document.querySelector(element) || null;
        let status = false;
        if (elem) {
          elem.addEventListener('click', () => { status = true }, true); // the callback will be invoked only once
          let clickInterval = setInterval(() => {
            click(element);
            if (status) clearInterval(clickInterval);
          }, 400);
        }
      }
      clearInterval(intervalId);
    } else {
      console.debug('Page is not loaded yet');
    }
  }, 1000);
}
