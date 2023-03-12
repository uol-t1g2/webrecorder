// import object selector to easily fetch DOM elements
import { finder } from '@medv/finder';

// Global recorded events array
let recordedEvents = [];
// Record play control variable
let currentlyPlaying = false;

// Our global event receiver from Popup
chrome.runtime.onMessage.addListener(function (msgObj) {
  console.debug('Got a message from Popup,', msgObj);

  // Receive messages based on a set of conditions
  switch (msgObj.action) {

    // If the recording has started
    case 'startRecording':
      console.debug('Should start recording here');
      // Attach global event listeners
      attachGlobalEventListeners();
      // Send confirmation message to console
      sendMessage({
        action: 'startedRecording',
        value: 'Hi from content (recorder)!',
      });
      break;

    // If the recording was stopped
    case 'stopRecording':
      console.debug('Should stop recording here');
      // detach global event listeners
      detachGlobalEventListeners();
      // Send confirmation message to console
      sendMessage({
        action: 'finishedRecording',
        value: JSON.stringify(recordedEvents, null, 2),
      });
      break;
    // If playing has started
    case 'startPlaying':
      currentlyPlaying = true;
      // Play the records from the Popup
      const eventsToPlay = JSON.parse(msgObj.value);
      playRecording(eventsToPlay);
      break;
    // If playing was stopped
    case 'stopPlaying':
      console.debug('Should stop playing recording...');
      sendMessage({
        action: 'stoppedPlaying',
        value: 'Hi from content (player)!',
      });
      break;
    // Otherwise - inform debug console that unknown parameters were received
    default:
      console.debug('Unknown action of', msgObj.action, ' received in Content');
  }
});

// A function that send messages to different contexts
function sendMessage(message) {
  chrome.runtime.sendMessage(message);
}

// A function that listens to click events and stores them in the recordedEvents array
function attachGlobalEventListeners() {
  // capture all click events
  document.body.addEventListener('click', listener);
}

// A function that listens to click events and stores them in the recordedEvents array
function detachGlobalEventListeners() {
  // remove the click listener
  document.body.removeEventListener('click', listener);
}

// A function to handle the global click event listener
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
    // Test whether the event was added via the debug console
    console.debug(
      'array length:',
      recordedEvents.length,
      '\nlast record:',
      recordedEvents[recordedEvents.length - 1]
    );
  } catch (err) {
    //Iin case an element selector could not be found - notify debug console
    console.debug("oops, we coldn't find a way to select this element");
  }
}

// a function that plays a recording when needed
async function playRecording(recordedEvents) {

  for (const event of recordedEvents) {
    // For each recorded click event
    if (event.type == 'click' && currentlyPlaying) {
      try {
        // Print event in console
        console.log(
          event.element,
          ' is caught from events \n',
          'total events: ',
          recordedEvents.length
        );
        // Wait for the clicked DOM element to load
        const status = await tryClickUntilExists(event.element, 1000, 5);
        // If the DOM element doesn't exist
        // Or if the loading of the element fails
        if (!status) {
          sendMessage({
            action: 'finishedPlaying',
            value: `failed on element ${event.element}`,
          });
          return;
        }
        // If an error occurs 
      } catch (e) {
        sendMessage({ action: 'finishedPlaying', value: `error occured ${e}` });
      }
    }
    else {
      sendMessage({
        action: 'stoppedPlaying',
        value: 'Stopped the play',
      });
      return;
    }
  }
  currentlyPlaying = false;
  // If no more events are left within recordedEvents - finished playing
  sendMessage({ action: 'finishedPlaying', value: 'Play completed' });
}

// A click function that expects selector, interval to retry, maximum retries as params
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
      // If clicked element is found or the maximum number of tries was reached
      if (status || (retries >= maxRetries)) {
        // reset and resolve
        clearInterval(clickInterval);
        resolve(status);
      }
      // Retry selecting the element
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
