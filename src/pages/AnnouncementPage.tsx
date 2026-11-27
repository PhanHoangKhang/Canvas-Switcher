
import {
  Megaphone,
  ExternalLink,
} from "lucide-react";

import type { Course } from "../App";
import type { CourseAnnouncement } from "../services/canvasService";

interface Props {
  course: Course;
  announcements: CourseAnnouncement[];
  error?: string;
}

export default function AnnouncementPage({
  course,
  announcements,
  error,
}: Props) {
  const openAnnouncement = (announcement: CourseAnnouncement) => {
    chrome.runtime.sendMessage({
      type: "NAVIGATE_CANVAS",
      url:
        announcement.html_url ??
        `https://rmit.instructure.com/courses/${course.id}/discussion_topics/${announcement.id}`,
    });
  };

  return (
    <div className="space-y-2 px-2 pb-3 pt-1">
      {/* Error */}
      {error && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">
            Unable to load announcements
          </p>

          <p className="mt-2 break-words text-xs text-text-secondary">
            {error}
          </p>

        </div>
      )}

      {/* Empty state */}
      {!error && announcements.length === 0 && (
        <div className="py-12 text-center">
          <Megaphone
            size={28}
            className="mx-auto text-text-muted"
          />

          <p className="mt-3 text-sm text-text-secondary">
            No announcements found.
          </p>
        </div>
      )}

      {/* Announcement list */}
      {!error && announcements.length > 0 && (
        <div className="space-y-3">
          {announcements.map((announcement) => (
            <button
              key={announcement.id}
              onClick={() => openAnnouncement(announcement)}
              className="flex w-full items-center gap-3 rounded-xl border border-border bg-surface p-3 text-left transition hover:bg-surface-hover"
            >
              <Megaphone size={18} className="shrink-0 text-accent" />
              <span className="min-w-0 flex-1 text-sm font-medium leading-snug">
                {announcement.title}
              </span>
              <ExternalLink size={15} className="shrink-0 text-text-muted" />
            </button>
          ))}
        </div>
      )}

    </div>
  );
}
