
interface Announcement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  html_url?: string;
}

export interface CourseAssignment {
  id: number;
  name: string;
  description?: string | null;
  due_at?: string | null;
  points_possible?: number | null;
  html_url?: string;
  workflow_state?: string;
}

export async function getCourseAnnouncements(
  courseId: number,
): Promise<Announcement[]> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "FETCH_CANVAS_API",
        endpoint: `/api/v1/announcements?context_codes[]=course_${courseId}`,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response?.success) {
          reject(
            new Error(response?.error || "Failed to fetch announcements"),
          );
          return;
        }

        resolve(response.data as Announcement[]);
      },
    );
  });
}

export async function getCourseAssignments(
  courseId: number,
): Promise<CourseAssignment[]> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "FETCH_CANVAS_API",
        endpoint: `/api/v1/courses/${courseId}/assignments?per_page=100`,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response?.success) {
          reject(new Error(response?.error || "Failed to fetch assignments"));
          return;
        }

        if (!Array.isArray(response.data)) {
          reject(new Error("Invalid assignments response"));
          return;
        }

        resolve(response.data as CourseAssignment[]);
      },
    );
  });
}
