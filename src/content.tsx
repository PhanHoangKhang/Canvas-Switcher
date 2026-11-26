
console.log("Canvas Switcher content script loaded");

const COURSE_REQUEST_TIMEOUT_MS = 30_000;

const hostname = window.location.hostname;
const isCanvasPage = hostname.endsWith(".instructure.com");

if (isCanvasPage) {
  console.log("Canvas detected:", hostname);
}

chrome.runtime.onMessage.addListener(
  (message, _sender, sendResponse) => {
    console.log("Content script received:", message.type);

    // Test connection
    if (message.type === "PING") {
      sendResponse({
        success: true,
        message: "Content script alive",
      });

      return;
    }

    // Fetch courses from Canvas API
    if (message.type === "GET_COURSES") {
      const controller = new AbortController();
      const timeoutId = setTimeout(
        () => controller.abort(),
        COURSE_REQUEST_TIMEOUT_MS,
      );

      (async () => {
        try {
          const response = await fetch(
            `${window.location.origin}/api/v1/courses?per_page=100`,
            {
              credentials: "include",
              signal: controller.signal,
            },
          );

          if (response.redirected) {
            throw new Error("UNAUTHENTICATED");
          }

          if (!response.ok) {
            throw new Error(`HTTP_${response.status}`);
          }

          const contentType = response.headers.get("content-type");

          if (!contentType?.includes("application/json")) {
            throw new Error("UNAUTHENTICATED");
          }

          const data = await response.json();

          if (!Array.isArray(data)) {
            throw new Error("INVALID_RESPONSE");
          }

          sendResponse({
            success: true,
            data,
          });
        } catch (error) {
          sendResponse({
            success: false,
            error:
              error instanceof Error && error.name === "AbortError"
                ? "Request timed out. Canvas took too long to respond. Please try again."
                : error instanceof Error
                  ? error.message
                  : "FAILED_TO_FETCH",
          });
        } finally {
          clearTimeout(timeoutId);
        }
      })();

      return true;
    }
  },
);
