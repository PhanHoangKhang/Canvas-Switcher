import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Database,
  Network,
  Palette,
  Search,
} from "lucide-react";
import type { Course } from "../App";
import CourseSkeleton from "../components/CourseSkeleton";
import { getCourses } from "../services/courseService";

interface Props {
  onSelectCourse: (course: Course) => void;
}

const courseIcons = [BookOpen, Database, Network, Palette];

export default function HomePage({ onSelectCourse }: Props) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

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

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      const query = searchQuery.toLowerCase();

      return (
        course.name.toLowerCase().includes(query) ||
        course.code.toLowerCase().includes(query)
      );
    });
  }, [courses, searchQuery]);

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

      <div className="mb-5 flex items-center gap-2 rounded-xl border border-border bg-surface px-3 py-3">
        <Search size={18} className="text-text-muted" />

        <input
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search courses..."
          className="w-full bg-transparent text-sm outline-none placeholder:text-text-muted"
        />

        <span className="rounded-md border border-border px-1.5 py-0.5 text-xs text-text-muted">
          /
        </span>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold">My Courses</h2>

        <span className="text-xs text-text-muted">
          {loading ? "..." : filteredCourses.length}
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

      {!loading && !error && filteredCourses.length === 0 && (
        <div className="py-10 text-center text-sm text-text-secondary">
          {courses.length === 0 ? "No courses found." : "No matching courses."}
        </div>
      )}

      {!loading && !error && (
        <div className="space-y-2">
          {filteredCourses.map((course, index) => {
            const Icon = courseIcons[index % courseIcons.length];

            return (
              <button
                key={course.id}
                onClick={() => onSelectCourse(course)}
                className="group flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition-all hover:border-accent/50 hover:bg-surface-hover"
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

                <ArrowRight
                  size={16}
                  className="shrink-0 text-text-muted transition group-hover:text-accent"
                />
              </button>
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
