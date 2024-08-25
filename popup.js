import { getCurrentTab } from "./utils.js";

document.getElementById('checkButton').addEventListener('click', async () => {
    // Set up a message listener before executing the content script
    document.getElementById('responseContent').textContent = "Analyzing...";
    chrome.runtime.onMessage.addListener(function(message) {
      if (message.action === 'sendContent') {
        if (message.content == 1) {
            document.getElementById('responseContent').textContent = "Beware, that's a clickbait!"
        } else {
            document.getElementById('responseContent').textContent = "You are good to go!"
        }
      }
    });
    const activeTab = await getCurrentTab();
    const tabId = activeTab.id;
    // Inject the content script into the active tab
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ['content.js']
    });
  });
  