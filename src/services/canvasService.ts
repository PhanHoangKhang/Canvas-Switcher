
export interface CourseAnnouncement {
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

export interface CourseModuleItem {
  id: number;
  title: string;
  type: string;
  html_url?: string | null;
  external_url?: string | null;
  url?: string | null;
  page_url?: string | null;
  content_id?: number | null;
}

export interface CourseModule {
  id: number;
  name: string;
  items?: CourseModuleItem[];
}

export type CourseContentKey = "modules" | "assignments" | "announcements";

export interface CourseContentData {
  modules: CourseModule[];
  assignments: CourseAssignment[];
  announcements: CourseAnnouncement[];
  errors: Partial<Record<CourseContentKey, string>>;
}

export async function getCourseAnnouncements(
  courseId: number,
): Promise<CourseAnnouncement[]> {
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

        if (!Array.isArray(response.data)) {
          reject(new Error("Invalid announcements response"));
          return;
        }

        resolve(response.data as CourseAnnouncement[]);
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

export async function getCourseModules(
  courseId: number,
): Promise<CourseModule[]> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      {
        type: "FETCH_CANVAS_API",
        endpoint: `/api/v1/courses/${courseId}/modules?include[]=items&per_page=100`,
      },
      (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response?.success) {
          reject(new Error(response?.error || "Failed to fetch modules"));
          return;
        }

        if (!Array.isArray(response.data)) {
          reject(new Error("Invalid modules response"));
          return;
        }

        resolve(response.data as CourseModule[]);
      },
    );
  });
}
