import { useState } from "react";
import {
  ChevronDown,
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
  modules,
  error,
}: Props) {
  const [expandedModuleIds, setExpandedModuleIds] = useState<number[]>([]);

  return (
    <div className="space-y-2 px-2 pb-3 pt-1">
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
          {modules.map((module) => {
            const isExpanded = expandedModuleIds.includes(module.id);
            const panelId = `course-${course.id}-module-${module.id}`;

            return (
              <section
                key={module.id}
                className="overflow-hidden rounded-xl border border-border bg-surface"
              >
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={panelId}
                  onClick={() =>
                    setExpandedModuleIds((current) =>
                      isExpanded
                        ? current.filter((id) => id !== module.id)
                        : [...current, module.id],
                    )
                  }
                  className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-surface-hover"
                >
                  <Folder size={18} className="shrink-0 text-accent" />
                  <span className="min-w-0 flex-1 text-sm font-semibold leading-snug">
                    {module.name}
                  </span>
                  <ChevronDown
                    size={17}
                    className={`shrink-0 text-text-muted transition-transform ${isExpanded ? "rotate-180" : ""}`}
                  />
                </button>

                <div
                  id={panelId}
                  hidden={!isExpanded}
                  className="space-y-1 border-t border-border p-2"
                >
                    {module.items && module.items.length > 0 ? (
                      module.items.map((item) =>
                        item.type.toLowerCase() === "subheader" ? (
                          <h3
                            key={item.id}
                            className="px-2.5 py-2 text-sm font-semibold leading-snug"
                          >
                            {item.title}
                          </h3>
                        ) : (
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
                              <p className="mt-1 text-xs text-text-muted">{item.type}</p>
                            </div>
                            <ExternalLink size={15} className="shrink-0 text-text-muted" />
                          </button>
                        ),
                      )
                    ) : (
                      <p className="px-2.5 py-2 text-xs text-text-muted">
                        No items in this module.
                      </p>
                    )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
