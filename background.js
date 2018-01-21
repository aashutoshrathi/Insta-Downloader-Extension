chrome.tabs.insertCSS(null, {file: "insta-down-css.css"});
chrome.tabs.insertCSS(null, {file: "fa5.css"});

chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.executeScript(null, { file: "download.js" });
});
