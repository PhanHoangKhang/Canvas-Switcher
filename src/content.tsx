console.log("Canvas Switcher content script loaded");

const hostname = window.location.hostname;

const isCanvasPage = hostname.endsWith(".instructure.com");

if (isCanvasPage) {
  console.log("Canvas detected:", hostname);
}

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    if (message.type === "GET_COURSES") {
      fetch(`${window.location.origin}/api/v1/courses?per_page=100`, {
        credentials: "include",
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }

          return response.json();
        })
        .then((data) => {
          sendResponse({
            success: true,
            data,
          });
        })
        .catch((error) => {
          sendResponse({
            success: false,
            error: error.message,
          });
        });

      return true;
    }
  },
);