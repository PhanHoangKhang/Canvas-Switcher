import { useState } from "react";
import {
  BarChart3,
  ChevronDown,
  ClipboardList,
  ExternalLink,
  Layers,
  Megaphone,
} from "lucide-react";
import logo from "../assets/logo.png";
import type { Course } from "../App";
import type { CourseContentData } from "../services/canvasService";
import ModulePage from "./ModulePage";
import AssignmentPage from "./AssignmentPage";
import AnnouncementPage from "./AnnouncementPage";

interface Props {
  courses: Course[];
  courseData: Record<number, CourseContentData>;
  expandedCourseIds: number[];
  onToggleCourse: (courseId: number) => void;
}

const destinations = [
  { label: "Modules", path: "modules", icon: Layers },
  { label: "Assignments", path: "assignments", icon: ClipboardList },
  { label: "Announcements", path: "announcements", icon: Megaphone },
  { label: "Grades", path: "grades", icon: BarChart3 },
] as const;

type ExpandableSection = "modules" | "assignments" | "announcements";

export default function HomePage({
  courses,
  courseData,
  expandedCourseIds,
  onToggleCourse,
}: Props) {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (courseId: number, section: ExpandableSection) => {
    const key = `${courseId}-${section}`;
    setExpandedSections((current) =>
      current.includes(key)
        ? current.filter((item) => item !== key)
        : [...current, key],
    );
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <header className="mb-6">
        <div className="flex items-center gap-3">
          <img src={logo} alt="Canvas Switcher logo" className="h-10 w-10 object-contain" />
          <div>
            <h1 className="text-lg font-bold">Canvas Switcher</h1>
            <p className="text-xs text-text-secondary">Your courses, one click away.</p>
          </div>
        </div>
      </header>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">My Courses</h2>
        <span className="text-xs text-text-muted">{courses.length}</span>
      </div>

      {courses.length === 0 && (
        <div className="py-10 text-center text-sm text-text-secondary">
          No courses found.
        </div>
      )}

      {courses.length > 0 && (
        <div className="space-y-2">
          {courses.map((course) => {
            const isExpanded = expandedCourseIds.includes(course.id);
            const data = courseData[course.id];

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
                  <div className="border-t border-border p-2">
                    {destinations.map(({ label, path, icon: DestinationIcon }) => {
                      const isExpandable = path !== "grades";
                      const section = isExpandable ? path as ExpandableSection : null;
                      const sectionKey = `${course.id}-${path}`;
                      const isSectionOpen = expandedSections.includes(sectionKey);

                      return (
                        <div key={path} className="border-b border-border last:border-b-0">
                          <div className="flex items-center gap-1 rounded-lg hover:bg-surface-hover">
                            <button
                              type="button"
                              aria-expanded={isExpandable ? isSectionOpen : undefined}
                              onClick={() => {
                                if (section) {
                                  toggleSection(course.id, section);
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
                              {isExpandable && (
                                <ChevronDown
                                  size={16}
                                  className={`text-text-muted transition-transform ${isSectionOpen ? "rotate-180" : ""}`}
                                />
                              )}
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

                          {isSectionOpen && data && section === "modules" && (
                            <ModulePage course={course} modules={data.modules} error={data.errors.modules} />
                          )}
                          {isSectionOpen && data && section === "assignments" && (
                            <AssignmentPage course={course} assignments={data.assignments} error={data.errors.assignments} />
                          )}
                          {isSectionOpen && data && section === "announcements" && (
                            <AnnouncementPage course={course} announcements={data.announcements} error={data.errors.announcements} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      <footer className="mt-6 border-t border-border pt-4">
        <p className="text-center text-xs text-text-muted">Canvas Switcher</p>
      </footer>
    </div>
  );
}
