
import {
  ArrowLeft,
  Layers,
  ClipboardList,
  Megaphone,
  BarChart3,
  ExternalLink,
} from "lucide-react";
import type { Course } from "../App";

interface Props {
  course: Course;
  onBack: () => void;
  onOpenModules: () => void;
}

const destinations = [
  {
    label: "Modules",
    icon: Layers,
    path: "modules",
  },
  {
    label: "Assignments",
    icon: ClipboardList,
    path: "assignments",
  },
  {
    label: "Announcements",
    icon: Megaphone,
    path: "announcements",
  },
  {
    label: "Grades",
    icon: BarChart3,
    path: "grades",
  },
];

export default function CoursePage({
  course,
  onBack,
  onOpenModules,
}: Props) {
  const navigateCanvas = (path: string) => {
    chrome.runtime.sendMessage({
      type: "NAVIGATE_CANVAS",
      url: `https://rmit.instructure.com/courses/${course.id}/${path}`,
    });
  };

  const handleInternalNavigation = (path: string) => {
    if (path === "modules") {
      onOpenModules();
    }
  };

  return (
    <div className="min-h-screen p-4">
      {/* Back */}
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
      >
        <ArrowLeft size={16} />
        Courses
      </button>

      {/* Course information */}
      <div className="mb-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Layers size={22} />
        </div>

        <h1 className="text-lg font-bold leading-snug">
          {course.name}
        </h1>

        <p className="mt-1 text-xs text-text-secondary">
          {course.code}
        </p>
      </div>

      {/* Navigation */}
      <h2 className="mb-3 text-sm font-semibold">
        Navigate
      </h2>

      <div className="space-y-2">
        {destinations.map(({ label, icon: Icon, path }) => (
          <div
            key={label}
            className="flex items-center gap-2 rounded-xl border border-border bg-surface p-2 transition hover:border-accent/40"
          >
            {/* Main navigation button */}
            <button
              onClick={() => handleInternalNavigation(path)}
              className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg p-1 text-left transition hover:bg-surface-hover"
            >
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
                <Icon size={20} />
              </div>

              <span className="flex-1 text-sm font-medium">
                {label}
              </span>
            </button>

            {/* Direct Canvas link */}
            <button
              onClick={() => navigateCanvas(path)}
              title={`Open ${label} in Canvas`}
              aria-label={`Open ${label} in Canvas`}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-text-muted transition hover:bg-accent/10 hover:text-accent"
            >
              <ExternalLink size={16} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer */}
      <footer className="mt-6 border-t border-border pt-4">
        <p className="text-center text-xs text-text-muted">
          Canvas Switcher · Beta
        </p>
      </footer>
    </div>
  );
}
