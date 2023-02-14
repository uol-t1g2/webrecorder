
var recordedEvents = [];

// ---------------------------------------------------
// ATTACH GLOBAL EVENT LISTENER
// ---------------------------------------------------

function attachGlobalEventListeners() {
  console.log('started listening -> attachGlobalEventListeners::Content/index.js');

  // left click listener
  // ---------------------------------------------------
  document.body.addEventListener('click', function (e) {
    recordedEvents.push({
      type: 'click',
      element: e.target,
      time: new Date().getTime()
    });

    // test wether the event was added
    console.log(
      'array length:', recordedEvents.length,
      '\nlast record:', recordedEvents[recordedEvents.length - 1]
    );

  });

  // right click (context menu) listener
  // ---------------------------------------------------
  document.body.addEventListener('contextmenu', function (e) {
    recordedEvents.push({
      type: 'contextmenu',
      element: e.target,
      time: new Date().getTime()
    });

    // test wether the event was added
    console.log(
      'array length:', recordedEvents.length,
      '\nlast record:', recordedEvents[recordedEvents.length - 1]
    );

  });

  // keydown listener
  // ---------------------------------------------------
  document.body.addEventListener('keydown', function (e) {

    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') {
      // awaiting follow up key
      // handled by the else close below*      
    }
    else {
      // listen to keys
      recordedEvents.push({
        type: 'keydown',
        key: e.key,
        keyCode: e.code,
        // *were other keys pressed simultaniously?
        is_ctrlKey: e.ctrlKey,
        is_altKey: e.altKey,
        is_shiftKey: e.shiftKey,
        time: new Date().getTime()
      });

      // test wether the event was added
      console.log(
        'array length:', recordedEvents.length,
        '\nlast record:', recordedEvents[recordedEvents.length - 1]
      );
    }
  });

  // URL change listener
  // ---------------------------------------------------
  window.addEventListener('hashchange', function (e) {
    recordedEvents.push({
      type: 'hashchange',
      newURL: e.newURL,
      oldURL: e.oldURL,
      time: new Date().getTime()
    });

    // test wether the event was added
    console.log(
      'array length:', recordedEvents.length,
      '\nlast record:', recordedEvents[recordedEvents.length - 1]
    );
  });

}

attachGlobalEventListeners();


/////////////////////////////
// TESTS - TO BE DELETED?
/////////////////////////////
console.log('Testing content script sending a message to popup');

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'helloFromPage',
});

// Create a click function for the content page task
// The function receives a selector and triggers the click event on it.
function click(selector) {

  const element = document.querySelector(selector) || null;
  if (element)
    element.click();
}



