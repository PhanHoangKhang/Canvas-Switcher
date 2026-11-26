
console.log("Canvas Switcher content script loaded");

const isCanvasPage =
  window.location.hostname.endsWith("instructure.com");

if (isCanvasPage) {
  console.log("Canvas detected:", window.location.hostname);
}
