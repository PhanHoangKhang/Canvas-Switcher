import type { CanvasCourse } from "../types/course";

export async function getCourses(): Promise<CanvasCourse[]> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: "GET_COURSES" },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response?.success) {
          reject(new Error(response?.error ?? "Failed to fetch courses"));
          return;
        }

        resolve(response.data);
      },
    );
  });
}