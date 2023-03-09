// import object selector to easily fetch DOM elements
import { finder } from '@medv/finder';

// Global recorded events array
let recordedEvents = [];

// Our global event receiver from Popup
chrome.runtime.onMessage.addListener(function (msgObj) {
  console.debug('Got a message from Popup,', msgObj);

  switch (msgObj.action) {
    case 'startRecording':
      console.debug('Should start recording here');
      // Attach global event listeners
      attachGlobalEventListeners();
      sendMessage({
        action: 'startedRecording',
        value: 'Hi from content (recorder)!',
      });
      break;
    case 'stopRecording':
      console.debug('Should stop recording here');
      // Detach global event listeners
      detachGlobalEventListeners();
      sendMessage({
        action: 'finishedRecording',
        value: JSON.stringify(recordedEvents, null, 2),
      });
      break;
    case 'startPlaying':
      // Play the records from the Popup
      const eventsToPlay = JSON.parse(msgObj.value);
      playRecording(eventsToPlay);
      break;
    case 'stopPlaying':
      console.debug('Should stop playing recording...');
      sendMessage({
        action: 'stoppedPlaying',
        value: 'Hi from content (player)!',
      });
      break;
    default:
      console.debug('Unkown action of', msgObj.action);
  }
});

function sendMessage(message) {
  chrome.runtime.sendMessage(message);
}

// A function that listens to click events and stores them in the recordedEvents array
function attachGlobalEventListeners() {
  // Capture all click events
  document.body.addEventListener('click', listener);
}
// A function that listens to click events and stores them in the recordedEvents array
function detachGlobalEventListeners() {
  // Remove the click listener
  document.body.removeEventListener('click', listener);
}
// Function to handle the global event listener
function listener(e) {
  try {
    // Find the best selector for click target (id/class/tag/attr)
    const selector = finder(e.target);
    // Store selector in recordedEvents
    recordedEvents.push({
      type: 'click',
      element: selector,
      time: new Date().getTime(),
    });
    // Test wether the event was added
    console.debug(
      'array length:',
      recordedEvents.length,
      '\nlast record:',
      recordedEvents[recordedEvents.length - 1]
    );
  } catch (err) {
    // In case an element selector could not be found
    console.debug("oops, we coldn't find a way to select this element");
  }
}

// The function plays a recording when needed
async function playRecording(recordedEvents) {
  for (const event of recordedEvents) {
    if (event.type == 'click') {
      try {
        console.log(
          event.element,
          ' is caught from events \n',
          'total events: ',
          recordedEvents.length
        );
        const status = await tryClickUntilExists(event.element, 1000, 5);
        if (!status) {
          sendMessage({
            action: 'finishedPlaying',
            value: `failed on element ${event.element}`,
          });
          return;
        }
      } catch (e) {
        sendMessage({ action: 'finishedPlaying', value: `error occured ${e}` });
      }
    }
  }
  sendMessage({ action: 'finishedPlaying', value: 'successful' });
}

// Click function that expects selector, interval to retry, maximum retries as params
function tryClickUntilExists(selector, interval = 400, maxRetries = 1) {
  return new Promise((resolve, reject) => {
    let retries = 1;
    let status = false;
    // Try until click exists
    let clickInterval = setInterval(() => {
      const element = document.querySelector(selector) || null;
      if (element) {
        try {
          click(element);
          status = true;
        } catch (e) {
          console.debug('click error: ', e);
          reject(new Error('failed to click'));
        }
      }
      if (status || (retries >= maxRetries)) {
        clearInterval(clickInterval);
        resolve(status);
      }
      retries++;
    }, interval);
  });
}

// Create a click function for the content page task
// The function receives a selector and triggers the click event on it.
function click(selector) {
  try {
    selector.click();
  } catch (e) {
    throw e;
  }
}
