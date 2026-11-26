import {
  ArrowLeft,
  ClipboardList,
  ExternalLink,
  FileText,
  Folder,
} from "lucide-react";
import type { Course } from "../App";
import {
  type CourseModule,
  type CourseModuleItem,
} from "../services/canvasService";

interface Props {
  course: Course;
  onBack: () => void;
  modules: CourseModule[];
  error?: string;
}

function ContentIcon({ type }: { type: string }) {
  if (type.toLowerCase().includes("assignment")) {
    return <ClipboardList size={17} />;
  }

  if (type.toLowerCase().includes("file")) {
    return <Folder size={17} />;
  }

  return <FileText size={17} />;
}

function getItemUrl(courseId: number, item: CourseModuleItem) {
  if (item.html_url) return item.html_url;
  if (item.external_url) return item.external_url;

  const baseUrl = `https://rmit.instructure.com/courses/${courseId}`;
  const type = item.type.toLowerCase();

  if (type === "page" && item.page_url) {
    return `${baseUrl}/pages/${encodeURIComponent(item.page_url)}`;
  }

  if (type === "assignment" && item.content_id) {
    return `${baseUrl}/assignments/${item.content_id}`;
  }

  if (type === "file" && item.content_id) {
    return `${baseUrl}/files/${item.content_id}`;
  }

  return `${baseUrl}/modules/items/${item.id}`;
}

function navigateToCanvas(url: string) {
  chrome.runtime.sendMessage({
    type: "NAVIGATE_CANVAS",
    url,
  });
}

export default function ModulePage({
  course,
  onBack,
  modules,
  error,
}: Props) {
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
        <h1 className="text-lg font-bold">Modules</h1>
        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          {course.name}
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">Unable to load modules</p>
          <p className="mt-2 break-words text-xs text-text-secondary">{error}</p>
        </div>
      )}

      {!error && modules.length === 0 && (
        <div className="py-10 text-center text-sm text-text-secondary">
          No modules found.
        </div>
      )}

      {!error && modules.length > 0 && (
        <div className="space-y-3">
          {modules.map((module) => (
            <div
              key={module.id}
              className="rounded-xl border border-border bg-surface p-3"
            >
              <div className="mb-3 flex items-start gap-2">
                <Folder size={18} className="mt-0.5 shrink-0 text-accent" />
                <h2 className="text-sm font-semibold leading-snug">
                  {module.name}
                </h2>
              </div>

              {module.items && module.items.length > 0 ? (
                <div className="space-y-1">
                  {module.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => navigateToCanvas(getItemUrl(course.id, item))}
                      className="flex w-full items-center gap-3 rounded-lg p-2.5 text-left transition hover:bg-surface-hover"
                    >
                      <span className="shrink-0 text-accent">
                        <ContentIcon type={item.type} />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm leading-snug">{item.title}</p>
                        <p className="mt-1 text-xs text-text-muted">
                          {item.type}
                        </p>
                      </div>
                      <ExternalLink
                        size={15}
                        className="shrink-0 text-text-muted"
                      />
                    </button>
                  ))}
                </div>
              ) : (
                <p className="pl-7 text-xs text-text-muted">No items in this module.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
