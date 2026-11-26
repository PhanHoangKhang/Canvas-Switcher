import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  ClipboardList,
  ExternalLink,
  RefreshCw,
} from "lucide-react";
import type { Course } from "../App";
import {
  getCourseAssignments,
  type CourseAssignment,
} from "../services/canvasService";

interface Props {
  course: Course;
  onBack: () => void;
}

export default function AssignmentPage({ course, onBack }: Props) {
  const [assignments, setAssignments] = useState<CourseAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAssignments = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAssignments(await getCourseAssignments(course.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load assignments");
    } finally {
      setLoading(false);
    }
  }, [course.id]);

  useEffect(() => {
    void fetchAssignments();
  }, [fetchAssignments]);

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
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-text-secondary transition hover:text-accent"
        >
          <ArrowLeft size={16} />
          Course
        </button>

        <button
          onClick={() => void fetchAssignments()}
          disabled={loading}
          title="Refresh assignments"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-hover hover:text-accent disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="mb-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <ClipboardList size={22} />
        </div>
        <h1 className="text-lg font-bold">Assignments</h1>
        <p className="mt-1 text-xs text-text-secondary">{course.name}</p>
      </div>

      {loading && (
        <div className="py-10 text-center text-sm text-text-secondary" role="status">
          Loading assignments...
        </div>
      )}

      {error && !loading && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">Unable to load assignments</p>
          <p className="mt-2 break-words text-xs text-text-secondary">{error}</p>
          <button
            onClick={() => void fetchAssignments()}
            className="mt-4 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-background"
          >
            Try again
          </button>
        </div>
      )}

      {!loading && !error && assignments.length === 0 && (
        <div className="py-10 text-center text-sm text-text-secondary">
          No assignments found.
        </div>
      )}

      {!loading && !error && assignments.length > 0 && (
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
