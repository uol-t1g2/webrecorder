console.log('Testing content script sending a message to popup');

chrome.runtime.sendMessage({
  from: 'content',
  subject: 'helloFromPage',
});
