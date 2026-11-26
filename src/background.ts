chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Fetch courses
  if (message.type === "GET_COURSES") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (!activeTab?.id) {
        sendResponse({
          success: false,
          error: "No active tab found",
        });
        return;
      }

      if (!activeTab.url?.startsWith("https://rmit.instructure.com/")) {
        sendResponse({
          success: false,
          error: "Please open Canvas first.",
        });
        return;
      }

      chrome.tabs.sendMessage(
        activeTab.id,
        { type: "GET_COURSES" },
        (response) => {
          if (chrome.runtime.lastError) {
            sendResponse({
              success: false,
              error:
                "Canvas content script is not responding. Reload the Canvas page.",
            });
            return;
          }

          sendResponse(response);
        },
      );
    });

    return true;
  }

  // Navigate Canvas
  if (message.type === "NAVIGATE_CANVAS") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const activeTab = tabs[0];

      if (!activeTab?.id) {
        sendResponse({ success: false });
        return;
      }

      chrome.tabs.update(activeTab.id, {
        url: message.url,
      });

      sendResponse({ success: true });
    });

    return true;
  }
});
