
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  ClipboardList,
  Folder,
} from "lucide-react";
import type { Course } from "../App";

interface Props {
  course: Course;
  onBack: () => void;
}

interface ModuleContent {
  id: number;
  title: string;
  type: "Page" | "Assignment" | "File";
  url: string;
}

interface Module {
  id: number;
  title: string;
  contents: ModuleContent[];
}

const modules: Module[] = [
  {
    id: 1,
    title: "Getting Started",
    contents: [
      {
        id: 101,
        title: "Course Introduction",
        type: "Page",
        url: "https://rmit.instructure.com/courses/181740",
      },
    ],
  },
  {
    id: 2,
    title: "Week 1 - Software Processes Overview",
    contents: [
      {
        id: 201,
        title: "Software Processes Overview",
        type: "Page",
        url: "https://rmit.instructure.com/courses/181740",
      },
      {
        id: 202,
        title: "Lecture Slides",
        type: "File",
        url: "https://rmit.instructure.com/courses/181740",
      },
    ],
  },
  {
    id: 3,
    title: "Week 2 - Agile Processes & User Stories",
    contents: [
      {
        id: 301,
        title: "Agile Processes",
        type: "Page",
        url: "https://rmit.instructure.com/courses/181740",
      },
      {
        id: 302,
        title: "User Story Assignment",
        type: "Assignment",
        url: "https://rmit.instructure.com/courses/181740",
      },
    ],
  },
  {
    id: 4,
    title: "Week 3 - Version Control",
    contents: [
      {
        id: 401,
        title: "Git Fundamentals",
        type: "Page",
        url: "https://rmit.instructure.com/courses/181740",
      },
      {
        id: 402,
        title: "Git Branching",
        type: "Page",
        url: "https://rmit.instructure.com/courses/181740",
      },
      {
        id: 403,
        title: "Git Practice Assignment",
        type: "Assignment",
        url: "https://rmit.instructure.com/courses/181740",
      },
    ],
  },
  {
    id: 5,
    title: "Week 4 - Architecture Patterns",
    contents: [
      {
        id: 501,
        title: "Architecture Patterns",
        type: "Page",
        url: "https://rmit.instructure.com/courses/181740",
      },
    ],
  },
];

function ContentIcon({ type }: { type: ModuleContent["type"] }) {
  if (type === "Assignment") {
    return <ClipboardList size={17} />;
  }

  if (type === "File") {
    return <Folder size={17} />;
  }

  return <FileText size={17} />;
}

export default function ModulePage({
  course,
  onBack,
}: Props) {
  return (
    <div className="min-h-screen bg-background p-4">
      <button
        onClick={onBack}
        className="mb-5 flex items-center gap-2 text-sm text-text-secondary transition hover:text-accent"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      <div className="mb-6">
        <h1 className="text-lg font-bold">
          Modules
        </h1>

        <p className="mt-2 text-xs leading-relaxed text-text-secondary">
          {course.name}
        </p>
      </div>

      <div className="space-y-3">
        {modules.map((module) => (
          <div
            key={module.id}
            className="rounded-xl border border-border bg-surface p-3"
          >
            <div className="mb-3 flex items-start gap-2">
              <Folder
                size={18}
                className="mt-0.5 shrink-0 text-accent"
              />

              <h2 className="text-sm font-semibold leading-snug">
                {module.title}
              </h2>
            </div>

            <div className="space-y-1">
              {module.contents.map((content) => (
                <a
                  key={content.id}
                  href={content.url}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 rounded-lg p-2.5 transition hover:bg-surface-hover"
                >
                  <span className="shrink-0 text-accent">
                    <ContentIcon type={content.type} />
                  </span>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm leading-snug">
                      {content.title}
                    </p>

                    <p className="mt-1 text-xs text-text-muted">
                      {content.type}
                    </p>
                  </div>

                  <ExternalLink
                    size={15}
                    className="shrink-0 text-text-muted"
                  />
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
