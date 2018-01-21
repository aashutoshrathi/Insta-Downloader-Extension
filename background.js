chrome.tabs.onUpdated.addListener(function() {
  chrome.tabs.executeScript(null, { file: "download.js" });
});
