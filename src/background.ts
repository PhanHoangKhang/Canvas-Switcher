chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Fetch courses from any open Canvas tab
  if (message.type === "GET_COURSES") {
    chrome.tabs.query(
      { url: "https://rmit.instructure.com/*" },
      (tabs) => {
        const canvasTab = tabs[0];

        if (!canvasTab?.id) {
          sendResponse({
            success: false,
            error: "No Canvas tab found. Please open Canvas first.",
          });
          return;
        }

        chrome.tabs.sendMessage(
          canvasTab.id,
          { type: "GET_COURSES" },
          (response) => {
            if (chrome.runtime.lastError) {
              sendResponse({
                success: false,
                error: chrome.runtime.lastError.message,
              });
              return;
            }

            sendResponse(response);
          },
        );
      },
    );

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