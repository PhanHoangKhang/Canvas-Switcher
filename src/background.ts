chrome.runtime.onInstalled.addListener(() => {
  chrome.sidePanel.setPanelBehavior({
    openPanelOnActionClick: true,
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  // Fetch courses from any open Canvas tab
  if (message.type === "GET_COURSES") {
    chrome.tabs.query({ url: "https://rmit.instructure.com/*" }, (tabs) => {
      chrome.tabs.query(
        {
          active: true,
          lastFocusedWindow: true,
          url: "https://rmit.instructure.com/*",
        },
        (activeCanvasTabs) => {
          const activeCanvasTab = activeCanvasTabs[0];
          const canvasTabs = activeCanvasTab
            ? [
                activeCanvasTab,
                ...tabs.filter((tab) => tab.id !== activeCanvasTab.id),
              ]
            : tabs;

          if (canvasTabs.length === 0) {
            sendResponse({
              success: false,
              error: "No Canvas tab found. Please open Canvas first.",
            });
            return;
          }

          const sendToCanvasTab = (index: number) => {
            const canvasTab = canvasTabs[index];

            if (!canvasTab?.id) {
              sendResponse({
                success: false,
                error:
                  "No usable Canvas tab found. Reload Canvas and try again.",
              });
              return;
            }

            chrome.tabs.sendMessage(
              canvasTab.id,
              { type: "GET_COURSES" },
              (response) => {
                if (chrome.runtime.lastError) {
                  if (index + 1 < canvasTabs.length) {
                    sendToCanvasTab(index + 1);
                    return;
                  }

                  sendResponse({
                    success: false,
                    error: `${chrome.runtime.lastError.message} Reload Canvas and try again.`,
                  });
                  return;
                }

                sendResponse(response);
              },
            );
          };

          sendToCanvasTab(0);
        },
      );
    });

    return true;
  }

  // Fetch generic Canvas API
  if (message.type === "FETCH_CANVAS_API") {
    chrome.tabs.query({ url: "https://rmit.instructure.com/*" }, (tabs) => {
      chrome.tabs.query(
        {
          active: true,
          lastFocusedWindow: true,
          url: "https://rmit.instructure.com/*",
        },
        (activeCanvasTabs) => {
          const activeCanvasTab = activeCanvasTabs[0];

          const canvasTabs = activeCanvasTab
            ? [
                activeCanvasTab,
                ...tabs.filter((tab) => tab.id !== activeCanvasTab.id),
              ]
            : tabs;

          if (canvasTabs.length === 0) {
            sendResponse({
              success: false,
              error: "No Canvas tab found. Please open Canvas first.",
            });
            return;
          }

          const sendToCanvasTab = (index: number) => {
            const canvasTab = canvasTabs[index];

            if (!canvasTab?.id) {
              sendResponse({
                success: false,
                error:
                  "No usable Canvas tab found. Reload Canvas and try again.",
              });
              return;
            }

            chrome.tabs.sendMessage(
              canvasTab.id,
              {
                type: "FETCH_CANVAS_API",
                endpoint: message.endpoint,
              },
              (response) => {
                if (chrome.runtime.lastError) {
                  if (index + 1 < canvasTabs.length) {
                    sendToCanvasTab(index + 1);
                    return;
                  }

                  sendResponse({
                    success: false,
                    error: `${chrome.runtime.lastError.message} Reload Canvas and try again.`,
                  });
                  return;
                }

                sendResponse(response);
              },
            );
          };

          sendToCanvasTab(0);
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
