// import object selector to easily fetch DOM elements
import { finder } from '@medv/finder';

// Global recorded events array
let recordedEvents = [];

// Our global event receiver from Popup
chrome.runtime.onMessage.addListener(function (msgObj) {
  console.debug('Got a message from Popup,', msgObj);

  // receive messages based on a set of conditions
  switch (msgObj.action) {

    // if the recording has started
    case 'startRecording':
      console.debug('Should start recording here');
      // attach global event listeners
      attachGlobalEventListeners();
      // send confirmation message to console
      sendMessage({
        action: 'startedRecording',
        value: 'Hi from content (recorder)!',
      });
      break;

    // if the recording was stopped
    case 'stopRecording':
      console.debug('Should stop recording here');
      // detach global event listeners
      detachGlobalEventListeners();
      // send confirmation message to console
      sendMessage({
        action: 'finishedRecording',
        value: JSON.stringify(recordedEvents, null, 2),
      });
      break;
    // if playing has started
    case 'startPlaying':
      playRecording(recordedEvents);
      break;
    // if playing was stopped
    case 'stopPlaying':
      console.debug('Should stop playing recording...');
      // send confirmation message to console
      sendMessage({
        action: 'stoppedPlaying',
        value: 'Hi from content (player)!',
      });
      break;
    // otherwise - inform debug console that unknown parameters were received
    default:
      console.debug('Unknown action of', msgObj.action, ' received in Content');
  }
});

// a function that send messages to different contexts
function sendMessage(message) {
  chrome.runtime.sendMessage(message);
}

// a function that listens to click events and stores them in the recordedEvents array
function attachGlobalEventListeners() {
  // capture all click events
  document.body.addEventListener('click', listener);
}

// a function that listens to click events and stores them in the recordedEvents array
function detachGlobalEventListeners() {
  // remove the click listener
  document.body.removeEventListener('click', listener);
}

// a function to handle the global click event listener
function listener(e) {
  try {
    // find the best selector for click target (id/class/tag/attr)
    const selector = finder(e.target);
    // store selector in recordedEvents
    recordedEvents.push({
      type: 'click',
      element: selector,
      time: new Date().getTime(),
    });
    // test wether the event was added via the debug console
    console.debug(
      'array length:',
      recordedEvents.length,
      '\nlast record:',
      recordedEvents[recordedEvents.length - 1]
    );
  } catch (err) {
    // in case an element selector could not be found - notify debug console
    console.debug("oops, we coldn't find a way to select this element");
  }
}

// a function that plays a recording when needed
async function playRecording(recordedEvents) {

  for (const event of recordedEvents) {
    // for each recorded click event
    if (event.type == 'click') {
      try {
        // print event in console
        console.log(
          event.element,
          ' is caught from events \n',
          'total events: ',
          recordedEvents.length
        );
        // wait for the clicked DOM element to load
        const status = await tryClickUntilExists(event.element, 1000, 5);
        // if the DOM element doesn't exist
        // or if the loading of the element fails
        if (!status) {
          sendMessage({
            action: 'finishedPlaying',
            value: `failed on element ${event.element}`,
          });
          return;
        }
        // if an error occurs 
      } catch (e) {
        sendMessage({ action: 'finishedPlaying', value: `error occured ${e}` });
      }
    }
  }
  // if no more events are left within recordedEvents - finished playing
  sendMessage({ action: 'finishedPlaying', value: 'finished playing' });
}

// a click function that expects selector, interval to retry, maximum retries as params
function tryClickUntilExists(selector, interval = 400, maxRetries = 1) {
  return new Promise((resolve, reject) => {
    let retries = 1;
    let status = false;
    // try until click exists
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
      // if clicked element is found or the maximum number of tries was reached
      if (status || (retries >= maxRetries)) {
        // reset and resolve
        clearInterval(clickInterval);
        resolve(status);
      }
      // retry selecting the element
      retries++;
    }, interval);
  });
}

// a function that receives a selector and triggers the click event on it.
function click(selector) {
  try {
    selector.click();
  } catch (e) {
    throw e;
  }
}
