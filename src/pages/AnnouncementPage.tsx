
import { useCallback, useEffect, useState } from "react";
import {
  ArrowLeft,
  Megaphone,
  RefreshCw,
  ExternalLink,
} from "lucide-react";

import type { Course } from "../App";
import { getCourseAnnouncements } from "../services/canvasService";

interface Props {
  course: Course;
  onBack: () => void;
}

interface Announcement {
  id: number;
  title: string;
  message: string;
  posted_at: string;
  html_url?: string;
}

export default function AnnouncementPage({
  course,
  onBack,
}: Props) {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAnnouncements = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCourseAnnouncements(course.id);
      setAnnouncements(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load announcements",
      );
    } finally {
      setLoading(false);
    }
  }, [course.id]);

  useEffect(() => {
    void fetchAnnouncements();
  }, [fetchAnnouncements]);

  const openAnnouncement = (announcement: Announcement) => {
    chrome.runtime.sendMessage({
      type: "NAVIGATE_CANVAS",
      url:
        announcement.html_url ??
        `https://rmit.instructure.com/courses/${course.id}/discussion_topics/${announcement.id}`,
    });
  };

  return (
    <div className="min-h-screen p-4">
      {/* Header actions */}
      <div className="mb-5 flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-text-secondary transition hover:text-accent"
        >
          <ArrowLeft size={16} />
          Course
        </button>

        <button
          onClick={() => void fetchAnnouncements()}
          disabled={loading}
          title="Refresh announcements"
          className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted transition hover:bg-surface-hover hover:text-accent disabled:opacity-50"
        >
          <RefreshCw
            size={16}
            className={loading ? "animate-spin" : ""}
          />
        </button>
      </div>

      {/* Page heading */}
      <div className="mb-6">
        <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Megaphone size={22} />
        </div>

        <h1 className="text-lg font-bold">
          Announcements
        </h1>

        <p className="mt-1 text-xs text-text-secondary">
          {course.name}
        </p>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-12 text-center">
          <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-[#9D65FD]" />

          <p className="mt-3 text-sm text-text-secondary">
            Loading announcements...
          </p>
        </div>
      )}

      {/* Error */}
      {error && !loading && (
        <div className="rounded-xl border border-border bg-surface p-4">
          <p className="text-sm font-medium">
            Unable to load announcements
          </p>

          <p className="mt-2 break-words text-xs text-text-secondary">
            {error}
          </p>

          <button
            onClick={() => void fetchAnnouncements()}
            className="mt-4 rounded-lg bg-accent px-3 py-2 text-xs font-semibold text-background"
          >
            Try again
          </button>
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && announcements.length === 0 && (
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
      {!loading && !error && announcements.length > 0 && (
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

      {/* Footer */}
      <footer className="mt-6 border-t border-border pt-4">
        <p className="text-center text-xs text-text-muted">
          Canvas Switcher · Beta
        </p>
      </footer>
    </div>
  );
}
