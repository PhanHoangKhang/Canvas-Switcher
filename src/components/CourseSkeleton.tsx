import { ArrowRight } from "lucide-react";

export default function CourseSkeleton() {
  return (
    <div className="space-y-2" aria-label="Loading courses" role="status">
      {Array.from({ length: 4 }, (_, index) => (
        <div
          key={index}
          className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3"
        >
          <div className="h-11 w-11 shrink-0 animate-pulse rounded-xl bg-border/60" />

          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-16 animate-pulse rounded bg-border/60" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-border/60" />
          </div>

          <ArrowRight size={16} aria-hidden="true" className="shrink-0 text-border" />
        </div>
      ))}
      <span className="sr-only">Loading courses...</span>
    </div>
  );
}
