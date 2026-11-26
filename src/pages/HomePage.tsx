
import { ArrowRight, BookOpen, Search } from "lucide-react";
import type { Course } from "../App";

interface Props {
  onSelectCourse: (course: Course) => void;
}

const courses: Course[] = [
  {
    id: 181740,
    name: "Software Engineering: Process and Tools",
    code: "COSC2010",
  },
  {
    id: 181741,
    name: "Database Applications",
    code: "COSC2401",
  },
  {
    id: 181742,
    name: "Networking",
    code: "COSC2200",
  },
  {
    id: 181743,
    name: "UX Design",
    code: "COSC2350",
  },
];

export default function HomePage({
  onSelectCourse,
}: Props) {
  return (
    <div className="min-h-screen p-4">
      <header className="mb-6">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-accent text-background">
            <BookOpen size={20} />
          </div>

          <div>
            <h1 className="font-bold text-lg">
              Canvas Switcher
            </h1>
            <p className="text-xs text-text-secondary">
              Your courses, one click away.
            </p>
          </div>
        </div>
      </header>

      <div className="mb-5 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3">
        <Search size={18} className="text-text-muted" />
        <span className="text-sm text-text-secondary">
          Search courses...
        </span>
        <span className="ml-auto text-xs text-text-muted">
          /
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          My Courses
        </h2>

        <span className="text-xs text-text-muted">
          {courses.length}
        </span>
      </div>

      <div className="space-y-2">
        {courses.map((course) => (
          <button
            key={course.id}
            onClick={() => onSelectCourse(course)}
            className="group flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition hover:border-accent/40 hover:bg-surface-hover"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
              <BookOpen size={18} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">
                {course.name}
              </p>

              <p className="mt-1 text-xs text-text-secondary">
                {course.code}
              </p>
            </div>

            <ArrowRight
              size={16}
              className="text-text-muted transition group-hover:text-accent"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
