chrome.webNavigation.onCompleted.addListener(
  function (navigationEvent) {
    let tabId = navigationEvent.tabId
    chrome.tabs.insertCSS(tabId, { file: 'insta-down-css.css' })
    chrome.tabs.executeScript(tabId, { file: 'download.js' })
  },
  { url: [{ hostSuffix: '.instagram.com' }] }
)
