var defaults = {
  "mirror": false,
  "hideWatermark": false,
  "hideBanner": false
}

chrome.storage.sync.get(defaults, function (result) {
  chrome.storage.sync.set(result)
});

chrome.commands.onCommand.addListener(function (command) {
  console.log('Command:', command);
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.tabs.sendMessage(tabs[0].id, { command: command });
  });
});

chrome.browserAction.onClicked.addListener(function (tab) {
  chrome.tabs.create({ url: "https://videochatru.com/embed/" });
});

chrome.runtime.onInstalled.addListener(function (details) {
  if (details.reason === "install")
    chrome.tabs.create({ url: "https://videochatru.com/embed/" })
});
