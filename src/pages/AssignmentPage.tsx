import {
  ArrowLeft,
  ClipboardList,
  ExternalLink,
} from "lucide-react";
import type { Course } from "../App";
import type { CourseAssignment } from "../services/canvasService";

interface Props {
  course: Course;
  onBack: () => void;
  assignments: CourseAssignment[];
  error?: string;
}

export default function AssignmentPage({
  course,
  onBack,
  assignments,
  error,
}: Props) {
  const openAssignment = (assignment: CourseAssignment) => {
    chrome.runtime.sendMessage({
      type: "NAVIGATE_CANVAS",
      url:
        assignment.html_url ??
        `https://rmit.instructure.com/courses/${course.id}/assignments/${assignment.id}`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mb-5">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-text-secondary transition hover:text-accent"
        >
          <ArrowLeft size={16} />
          Courses
        </button>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <ClipboardList size={22} />
        </div>
        <h1 className="text-lg font-bold">Assignments</h1>
        <p className="mt-1 text-xs text-text-secondary">{course.name}</p>
      </div>

      {error && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">Unable to load assignments</p>
          <p className="mt-2 break-words text-xs text-text-secondary">{error}</p>
        </div>
      )}

      {!error && assignments.length === 0 && (
        <div className="py-10 text-center text-sm text-text-secondary">
          No assignments found.
        </div>
      )}

      {!error && assignments.length > 0 && (
        <div className="space-y-3">
          {assignments.map((assignment) => (
            <button
              key={assignment.id}
              onClick={() => openAssignment(assignment)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition hover:bg-surface-hover"
            >
              <ClipboardList size={18} className="shrink-0 text-accent" />
              <span className="min-w-0 flex-1 text-sm font-medium leading-snug">
                {assignment.name}
              </span>
              <ExternalLink size={15} className="shrink-0 text-text-muted" />
            </button>
          ))}
        </div>
      )}

      <footer className="mt-6 border-t border-border pt-4">
        <p className="text-center text-xs text-text-muted">Canvas Switcher · Beta</p>
      </footer>
    </div>
  );
}
