
import { ArrowLeft, Folder, ArrowRight } from "lucide-react";
import type { Course } from "../App";

interface Props {
  course: Course;
  onBack: () => void;
}

const modules = [
  "Getting Started",
  "Week 1 - Software Processes Overview",
  "Week 2 - Agile Processes & User Stories",
  "Week 3 - Version Control",
  "Week 4 - Architecture Patterns",
  "Week 5 - Continuous Integration",
  "Week 6 - Testing Introduction",
  "Week 7 - Testing Strategy",
];

export default function ModulePage({
  course,
  onBack,
}: Props) {
  return (
    <div className="min-h-screen p-4">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <h1 className="text-lg font-bold">Modules</h1>

      <p className="mt-1 mb-5 text-xs text-text-secondary">
        {course.name}
      </p>

      <div className="space-y-2">
        {modules.map((module) => (
          <button
            key={module}
            className="group flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition hover:border-accent/40 hover:bg-surface-hover"
          >
            <Folder
              size={18}
              className="shrink-0 text-accent"
            />

            <span className="flex-1 text-sm">
              {module}
            </span>

            <ArrowRight
              size={16}
              className="text-text-muted group-hover:text-accent"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
