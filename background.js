chrome.tabs.insertCSS(null, {file: "insta-down-css.css"});

chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.executeScript(null, { file: "download.js" });
});
