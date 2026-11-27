import {
  ClipboardList,
  ExternalLink,
} from "lucide-react";
import type { Course } from "../App";
import type { CourseAssignment } from "../services/canvasService";

interface Props {
  course: Course;
  assignments: CourseAssignment[];
  error?: string;
}

export default function AssignmentPage({
  course,
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
    <div className="space-y-2 px-2 pb-3 pt-1">
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

    </div>
  );
}
