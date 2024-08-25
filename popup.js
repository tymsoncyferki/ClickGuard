import { getCurrentTab } from "./utils.js";

document.getElementById('checkButton').addEventListener('click', async () => {
    // Set up a message listener before executing the content script
    document.getElementById('responseContent').textContent = "you clicked";
    chrome.runtime.onMessage.addListener(function(message) {
      if (message.action === 'sendContent') {
        document.getElementById('responseContent').textContent = message.content;
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
  