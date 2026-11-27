import { useCallback, useEffect, useRef, useState } from "react";

import HomePage from "./pages/HomePage";

import LoginPage from "./components/LoginPage";
import LoadingPage from "./components/LoadingPage";
import RefreshButton from "./components/RefreshButton";
import TermsPage from "./pages/TermsPage";

import { getCourses } from "./services/courseService";
import {
  getCourseAnnouncements,
  getCourseAssignments,
  getCourseModules,
  type CourseAnnouncement,
  type CourseAssignment,
  type CourseContentData,
  type CourseModule,
} from "./services/canvasService";

export type AppState = "loading" | "login" | "authenticated";

export interface Course {
  id: number;
  name: string;
  code: string;
}

type LoadTask =
  | {
      courseId: number;
      key: "modules";
      load: () => Promise<CourseModule[]>;
    }
  | {
      courseId: number;
      key: "assignments";
      load: () => Promise<CourseAssignment[]>;
    }
  | {
      courseId: number;
      key: "announcements";
      load: () => Promise<CourseAnnouncement[]>;
    };

function emptyCourseData(): CourseContentData {
  return {
    modules: [],
    assignments: [],
    announcements: [],
    errors: {},
  };
}

export default function App() {
  const termsVersion = "2026-11-27";
  const acceptedTerms = localStorage.getItem("canvas-switcher-terms-version") === termsVersion;
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(acceptedTerms);
  const [showTerms, setShowTerms] = useState(!acceptedTerms);
  const [termsChecked, setTermsChecked] = useState(false);
  const [appState, setAppState] = useState<AppState>("loading");
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseData, setCourseData] = useState<Record<number, CourseContentData>>({});
  const [expandedCourseIds, setExpandedCourseIds] = useState<number[]>([]);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadMessage, setLoadMessage] = useState("Checking your Canvas session...");
  const initialLoadStarted = useRef(false);
  const [isChecking, setIsChecking] = useState(false);

  const checkCanvasSession = useCallback(async () => {
    setLoadProgress(0);
    setLoadMessage("Checking your Canvas session...");

    try {
      const canvasCourses = await getCourses();
      const now = new Date();
      const availableCourses = canvasCourses.filter((course) => {
        const isStarted = !course.start_at || new Date(course.start_at) <= now;
        const isNotEnded = !course.end_at || new Date(course.end_at) >= now;

        return (
          course.workflow_state === "available" && isStarted && isNotEnded
        );
      });

      const mappedCourses: Course[] = availableCourses.map((course) => ({
        id: course.id,
        name: course.name,
        code: course.course_code,
      }));

      setCourses(mappedCourses);

      const initialData = Object.fromEntries(
        mappedCourses.map((course) => [course.id, emptyCourseData()]),
      ) as Record<number, CourseContentData>;
      setCourseData(initialData);

      const tasks: LoadTask[] = [];
      mappedCourses.forEach((course) => {
        tasks.push(
          {
            courseId: course.id,
            key: "modules",
            load: () => getCourseModules(course.id),
          },
          {
            courseId: course.id,
            key: "assignments",
            load: () => getCourseAssignments(course.id),
          },
          {
            courseId: course.id,
            key: "announcements",
            load: () => getCourseAnnouncements(course.id),
          },
        );
      });

      const totalSteps = tasks.length + 1;
      setLoadProgress(Math.round((1 / totalSteps) * 100));
      setLoadMessage(
        tasks.length > 0
          ? `Loaded courses. Preparing ${tasks.length} course data sets...`
          : "No active courses to load.",
      );

      let nextTaskIndex = 0;
      let completedTasks = 0;
      const runWorker = async () => {
        while (nextTaskIndex < tasks.length) {
          const task = tasks[nextTaskIndex++];

          try {
            const value = await task.load();
            setCourseData((current) => {
              const data = current[task.courseId] ?? emptyCourseData();
              const updated: CourseContentData = {
                ...data,
                errors: { ...data.errors },
              };

              if (task.key === "modules") updated.modules = value as CourseModule[];
              if (task.key === "assignments") {
                updated.assignments = value as CourseAssignment[];
              }
              if (task.key === "announcements") {
                updated.announcements = value as CourseAnnouncement[];
              }
              delete updated.errors[task.key];

              return { ...current, [task.courseId]: updated };
            });
          } catch (error) {
            const message =
              error instanceof Error ? error.message : `Failed to load ${task.key}`;
            setCourseData((current) => {
              const data = current[task.courseId] ?? emptyCourseData();
              return {
                ...current,
                [task.courseId]: {
                  ...data,
                  errors: { ...data.errors, [task.key]: message },
                },
              };
            });
          } finally {
            completedTasks += 1;
            setLoadProgress(
              Math.round(((completedTasks + 1) / totalSteps) * 100),
            );
            setLoadMessage(
              `Loaded ${completedTasks} of ${tasks.length} course data sets...`,
            );
          }
        }
      };

      await Promise.all(
        Array.from({ length: Math.min(4, tasks.length) }, () => runWorker()),
      );

      setLoadProgress(100);
      setLoadMessage("Everything is ready.");
      setAppState("authenticated");
    } catch {
      setAppState("login");
    } finally {
      setIsChecking(false);
    }
  }, []);

  const refreshCanvasSession = useCallback(() => {
    setIsChecking(true);
    setAppState("loading");
    void checkCanvasSession();
  }, [checkCanvasSession]);

  useEffect(() => {
    if (!hasAcceptedTerms) return;
    if (initialLoadStarted.current) return;
    initialLoadStarted.current = true;
    void checkCanvasSession();
  }, [checkCanvasSession, hasAcceptedTerms]);

  const acceptTerms = () => {
    if (!termsChecked) return;
    localStorage.setItem("canvas-switcher-terms-version", termsVersion);
    setHasAcceptedTerms(true);
    setShowTerms(false);
  };

  const toggleCourse = (courseId: number) => {
    setExpandedCourseIds((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId],
    );
  };

  if (hasAcceptedTerms && appState === "loading" && !showTerms) {
    return <LoadingPage progress={loadProgress} message={loadMessage} />;
  }

  return (
    <div className="relative min-h-screen bg-background pb-14 text-text-primary">
      {hasAcceptedTerms && !showTerms && <div className="absolute right-3 top-3 z-50">
        <RefreshButton
          onClick={refreshCanvasSession}
          isLoading={isChecking}
        />
      </div>}

      {showTerms ? (
        <TermsPage
          isGate={!hasAcceptedTerms}
          checked={termsChecked}
          onCheckedChange={setTermsChecked}
          onAgree={acceptTerms}
          onClose={() => setShowTerms(false)}
        />
      ) : appState === "login" ? <LoginPage /> : null}

      {!showTerms && appState === "authenticated" && (
        <HomePage
          courses={courses}
          courseData={courseData}
          expandedCourseIds={expandedCourseIds}
          onToggleCourse={toggleCourse}
        />
      )}
      <footer className="fixed inset-x-0 bottom-0 z-40 flex items-center justify-center gap-3 border-t border-border bg-background px-4 py-3 text-xs text-text-secondary shadow-[0_-2px_8px_rgba(0,0,0,0.04)]">
        <span className="text-text-secondary">Canvas Switcher</span>
        <span aria-hidden="true" className="text-border">·</span>
        <button
          type="button"
          className="font-semibold text-accent underline-offset-4 hover:underline"
          onClick={() => setShowTerms(true)}
        >
          Terms of Use &amp; Privacy
        </button>
      </footer>
    </div>
  );
}
