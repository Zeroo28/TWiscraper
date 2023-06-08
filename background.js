// Listen for messages from content scripts
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.action === "downloadImages" && Array.isArray(message.urls)) {
    message.urls.forEach(function (url) {
      console.log("TWIS: Downloading image: " + url);
      chrome.downloads.download({ url: url });
    });
  }
});
