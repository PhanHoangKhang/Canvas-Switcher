
import { useEffect, useState } from "react";
import {
  BarChart3,
  BookOpen,
  ChevronDown,
  ClipboardList,
  Database,
  ExternalLink,
  Layers,
  Megaphone,
  Network,
  Palette,
} from "lucide-react";
import type { Course } from "../App";
import CourseSkeleton from "../components/CourseSkeleton";
import { getCourses } from "../services/courseService";

interface Props {
  expandedCourseIds: number[];
  onToggleCourse: (courseId: number) => void;
  onNavigate: (
    course: Course,
    screen: "modules" | "assignments" | "announcements",
  ) => void;
}

const courseIcons = [BookOpen, Database, Network, Palette];

const destinations = [
  { label: "Modules", path: "modules", icon: Layers },
  { label: "Assignments", path: "assignments", icon: ClipboardList },
  { label: "Announcements", path: "announcements", icon: Megaphone },
  { label: "Grades", path: "grades", icon: BarChart3 },
] as const;

export default function HomePage({
  expandedCourseIds,
  onToggleCourse,
  onNavigate,
}: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchCourses() {
      try {
        setLoading(true);
        setError(null);

        const data = await getCourses();

        const currentCourses = data.filter((course) => {
          const now = new Date();

          const isStarted =
            !course.start_at || new Date(course.start_at) <= now;

          const isNotEnded = !course.end_at || new Date(course.end_at) >= now;

          return (
            course.workflow_state === "available" && isStarted && isNotEnded
          );
        });

        const mappedCourses: Course[] = currentCourses.map((course) => ({
          id: course.id,
          name: course.name,
          code: course.course_code,
        }));

        setCourses(mappedCourses);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load courses");
      } finally {
        setLoading(false);
      }
    }

    fetchCourses();
  }, []);

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-background">
            <BookOpen size={20} />
          </div>

          <div>
            <h1 className="text-lg font-bold">Canvas Switcher</h1>

            <p className="text-xs text-text-secondary">
              Your courses, one click away.
            </p>
          </div>
        </div>
      </header>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">My Courses</h2>

        <span className="text-xs text-text-muted">
          {loading ? "..." : courses.length}
        </span>
      </div>

      {loading && <CourseSkeleton />}

      {error && !loading && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">Unable to load courses</p>

          <p className="mt-2 text-xs text-text-secondary break-words">
            {error}
          </p>
        </div>
      )}

      {!loading && !error && courses.length === 0 && (
        <div className="py-10 text-center text-sm text-text-secondary">
          No courses found.
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-2">
          {courses.map((course, index) => {
            const Icon = courseIcons[index % courseIcons.length];
            const isExpanded = expandedCourseIds.includes(course.id);

            return (
              <section
                key={course.id}
                className="overflow-hidden rounded-xl border border-border bg-surface transition-colors hover:border-accent/50"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  onClick={() => onToggleCourse(course.id)}
                  className="group flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-surface-hover"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-text-secondary">{course.code}</p>
                    <p className="mt-1 line-clamp-2 text-sm font-medium leading-snug">
                      {course.name}
                    </p>
                  </div>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-text-muted transition-transform group-hover:text-accent ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                {isExpanded && (
                  <div className="space-y-1 border-t border-border p-2">
                    {destinations.map(({ label, path, icon: DestinationIcon }) => (
                      <div
                        key={path}
                        className="flex items-center gap-2 rounded-lg transition-colors hover:bg-surface-hover"
                      >
                        <button
                          type="button"
                          onClick={() => {
                            if (path === "modules" || path === "assignments" || path === "announcements") {
                              onNavigate(course, path);
                            } else {
                              chrome.runtime.sendMessage({
                                type: "NAVIGATE_CANVAS",
                                url: `https://rmit.instructure.com/courses/${course.id}/${path}`,
                              });
                            }
                          }}
                          className="flex min-w-0 flex-1 items-center gap-3 rounded-lg p-2 text-left"
                        >
                          <DestinationIcon size={17} className="shrink-0 text-accent" />
                          <span className="flex-1 text-sm font-medium">{label}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            chrome.runtime.sendMessage({
                              type: "NAVIGATE_CANVAS",
                              url: `https://rmit.instructure.com/courses/${course.id}/${path}`,
                            })
                          }
                          title={`Open ${label} in Canvas`}
                          aria-label={`Open ${label} in Canvas`}
                          className="mr-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-accent/10 hover:text-accent"
                        >
                          <ExternalLink size={15} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <footer className="mt-6 border-t border-border pt-4">
        <p className="text-center text-xs text-text-muted">
          Canvas Switcher · Beta
        </p>
      </footer>
    </div>
  );
}
