
var recordedEvents = []; // store events
var clipboard = []; // store user copied text

// ---------------------------------------------------
// ATTACH GLOBAL EVENT LISTENER
// ---------------------------------------------------

function attachGlobalEventListeners() {
  /*
  a function that listens for 4 events:
    - click (left mouse)
    - contextmenu (right mouse)
    - keydown events
        >> handles multi-button presses (key + Ctrl + Alt + Shift)
        >> handles copiying text to global clipboard
    - URL change
  */

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

    // non-functional when standalone keys
    if (e.key === 'Shift' || e.key === 'Control' || e.key === 'Alt') {
      // awaiting follow up key which is handled by the else close*      
    }

    // Cntrl + c is pressed after a selection (of text) was made
    else if (e.code === 'KeyC' && e.ctrlKey === true && window.getSelection().getRangeAt(0).cloneContents().textContent !== '') {

      // store copied text in the clipboard
      clipboard.push(
        window.getSelection().getRangeAt(0).cloneContents().textContent
      );

      // test wheter the selection was recorded accuratley
      console.log("copied to clipboard:", clipboard[clipboard.length - 1]);

    }

    // all other keys
    else {

      // store event
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
    // store event
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

// temporary call location - must be associated to a "record" state only
attachGlobalEventListeners();


/////////////////////////////
// TESTS - TO BE DELETED?
/////////////////////////////
console.log('Testing content script sending a message to popup');

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'helloFromPage',
});

//////////////////////////////////////////////////////////
// PLEASE NOTE - THIS FUNCTION IS NOT CALLED ANYWHERE YET!
//////////////////////////////////////////////////////////

// Create a click function for the content page task
// The function receives a selector and triggers the click event on it.
function click(selector) {

  const element = document.querySelector(selector) || null;
  if (element)
    element.click();
}



