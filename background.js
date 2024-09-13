// background, currently not in use 

chrome.tabs.onActivated.addListener(() => {
    console.log('tab activated');
    chrome.tabs.onUpdated.addListener((updatedInfo) => {
            console.log('tab updated');
            const sourceUrl = updatedInfo.url;
            console.log('new url', sourceUrl);
            chrome.storage.local.get([sourceUrl]).then((result) => {
                let iconName;
                if (result[sourceUrl] === 1) {
                    iconName = "icons/icon16_red.png";
                } else if (result[sourceUrl] === 0) {
                    iconName = "icons/icon16_green.png";
                } else {
                    iconName = "icons/icon16.png";
                }
                chrome.action.setIcon({ path: iconName });
              });
        }
      );
});

// idea -> move access to storage to auto.js, send message to background, 
// in background set the icon with additional param tabId: tab.id

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
//     if (message.action === "setIcon") {
//         chrome.action.setIcon({ tabId: tab.id, path: message.icon });
//     }
// });

// add to manifest
// "background": {
//     "service_worker": "background.js"
// },