// chrome.storage.local.get([sourceUrl]).then((result) => {
//     let iconName;
//     if (result[sourceUrl] === 1) {
//         iconName = "icons/icon16_red.png";
//     } else if (result[sourceUrl] === 0) {
//         iconName = "icons/icon16_green.png";
//     } else {
//         iconName = "icons/icon16.png";
//     }
//     chrome.runtime.sendMessage({ action: "setIcon", icon: iconName });
//   });