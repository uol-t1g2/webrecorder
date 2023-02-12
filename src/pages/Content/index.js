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
