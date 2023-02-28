// Global recorded events array
let recordedEvents = [];

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
  try {
    selector.click();
  } catch (e) {
    throw e;
  }
}

// The function plays a recording when needed
async function playRecording(recordedEvents) {
  for (const element of recordedEvents) {
    try {
      const status = await tryClickUntilExists(element, 1000, 5);
      if (!status) {
        sendMessage({ action: "finishedPlaying", value: `failed on element ${element}` });
        return;
      }
    } catch (e) {
      sendMessage({ action: "finishedPlaying", value: `error occured ${e}` });
    }
  }
  sendMessage({ action: "finishedPlaying", value: "finished playing" });
}

//Click function that expects selector, interval to retry, maximum retries as params
function tryClickUntilExists(selector, interval = 400, maxRetries = 1) {
  return new Promise((resolve, reject) => {
    let retries = 1;
    let status = false;
    //try until click exists
    let clickInterval = setInterval(() => {
      const element = document.querySelector(selector) || null;
      if (element) {
        try {
          click(element);
          status = true;
        } catch (e) {
          console.debug('click error: ', e);
          reject(new Error("failed to click"));
        }
      }
      if (status || (retries >= maxRetries)) {
        clearInterval(clickInterval);
        resolve(status);
      }
      retries++;
    }, interval);
  })
}
