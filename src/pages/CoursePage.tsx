
import {
  ArrowLeft,
  Layers,
  ClipboardList,
  Megaphone,
  Folder,
  Search,
  BarChart3,
} from "lucide-react";
import type { Course } from "../App";

interface Props {
  course: Course;
  onBack: () => void;
  onOpenModules: () => void;
  onSearch: () => void;
}

const destinations = [
  { label: "Modules", icon: Layers },
  { label: "Assignments", icon: ClipboardList },
  { label: "Announcements", icon: Megaphone },
  { label: "Files", icon: Folder },
  { label: "Grades", icon: BarChart3 },
];

export default function CoursePage({
  course,
  onBack,
  onOpenModules,
  onSearch,
}: Props) {
  return (
    <div className="min-h-screen p-4">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm text-text-secondary hover:text-accent"
      >
        <ArrowLeft size={16} />
        Courses
      </button>

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

      <button
        onClick={onSearch}
        className="mb-5 flex w-full items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3 text-sm text-text-secondary hover:border-accent/40"
      >
        <Search size={18} />
        Search in course...
      </button>

      <h2 className="mb-3 text-sm font-semibold">
        Navigate
      </h2>

      <div className="space-y-2">
        {destinations.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={
              label === "Modules"
                ? onOpenModules
                : undefined
            }
            className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 transition hover:bg-surface-hover"
          >
            <Icon size={18} className="text-accent" />

            <span className="flex-1 text-left text-sm">
              {label}
            </span>

            <span className="text-text-muted">›</span>
          </button>
        ))}
      </div>
    </div>
  );
}
