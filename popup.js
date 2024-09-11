import { getCurrentTab } from "./utils.js";

document.getElementById('checkButton').addEventListener('click', async () => {
    // set up message listener
    document.getElementById('responseContent').textContent = "Analyzing...";
    chrome.runtime.onMessage.addListener(function(message) {
      if (message.action === 'sendContent') {
        if (message.content == 1) {
            document.getElementById('responseContent').textContent = "Beware, that's a clickbait!"
        } else if (message.content == 0) {
            document.getElementById('responseContent').textContent = "You are good to go!"
        } else {
            document.getElementById('responseContent').textContent = "Unknown response. Cannot check for clickbaits :("
        }
      }
    });
    const activeTab = await getCurrentTab();
    const tabId = activeTab.id;
    // execute script in active tab
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  });
  