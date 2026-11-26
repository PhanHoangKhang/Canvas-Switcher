chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });
});

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type === "NAVIGATE_CANVAS") {
      chrome.tabs.query(
        { active: true, currentWindow: true },
        (tabs) => {
          const activeTab = tabs[0];

          if (!activeTab?.id) {
            sendResponse({ success: false });
            return;
          }

          chrome.tabs.update(activeTab.id, {
            url: message.url,
          });

          sendResponse({ success: true });
        },
      );

      return true;
    }
  },
);