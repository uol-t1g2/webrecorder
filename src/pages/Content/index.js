// Our global event receiver from Popup
chrome.runtime.onMessage.addListener(function (msgObj) {
  console.debug('Got a message from Popup,', msgObj);
});

chrome.runtime.sendMessage({
  data: 'Hi from content page!',
});

// Create a click function for the content page task
// The function receives a selector and triggers the click event on it.
function click(selector) {
  const element = document.querySelector(selector) || null;
  if (element) element.click();
}
// The function plays a recording when needed
function playRecording(recordedEvents) {
  recordedEvents.forEach(element => {
    document.querySelector(element.selector).eval(element.type)();
  });
}