chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    let url = tabs[0].url;
    if (url.includes("youtube.com")) {
      chrome.runtime.sendMessage({redirect: url});
    }
  });