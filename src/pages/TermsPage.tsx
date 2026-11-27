interface TermsPageProps {
  isGate: boolean;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onAgree: () => void;
  onClose: () => void;
}

export default function TermsPage({
  isGate,
  checked,
  onCheckedChange,
  onAgree,
  onClose,
}: TermsPageProps) {
  return (
    <main className="mx-auto w-full max-w-2xl px-5 py-8">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold">Terms of Use &amp; Privacy</h1>
          <p className="mt-1 text-sm text-text-primary">
            Last updated: 27 November 2026
          </p>
        </div>

        {!isGate && (
          <button
            type="button"
            onClick={onClose}
            className="rounded-md px-3 py-2 text-sm font-bold text-text-primary hover:bg-surface-hover"
          >
            Back to app
          </button>
        )}
      </div>

      {isGate && (
        <p className="mb-5 rounded-lg border border-accent/30 bg-surface p-4 text-sm leading-6 text-text-primary">
          Please review and agree to these terms before using Canvas Switcher.
        </p>
      )}

      <div className="space-y-6 rounded-lg border border-border bg-surface p-5 text-sm leading-6 text-text-primary">
        <section>
          <h2 className="mb-2 font-extrabold">
            1. What information Canvas Switcher accesses
          </h2>
          <p className="mb-2">
            Canvas Switcher uses your existing authenticated Canvas session to
            retrieve and display course-related information, including:
          </p>
          <ul className="list-disc space-y-1 pl-5">
            <li>Course names and codes</li>
            <li>Announcement titles, messages and dates</li>
            <li>Assignment names, descriptions, due dates and possible points</li>
            <li>Module names, item details and links</li>
          </ul>
          <p className="mt-2">
            Canvas Switcher does not ask for or collect your Canvas password.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-extrabold">
            2. How your information is used
          </h2>
          <p>
            The information accessed by Canvas Switcher is used solely to display
            your courses and provide navigation to Canvas resources, helping you
            access learning materials more conveniently.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-extrabold">
            3. Data storage and sharing
          </h2>
          <p>
            Course information is retrieved directly from supported Canvas sites
            and processed within the extension. It is held in memory while the
            extension is in use, is not stored for later use, and is not sent to
            the developer or shared with third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-extrabold">
            4. Permissions
          </h2>
          <p className="mb-2">
            Canvas Switcher uses browser permissions to provide its features:
          </p>
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong>Tabs:</strong> Allows the extension to identify open Canvas
              tabs and open selected course resources.
            </li>
            <li>
              <strong>Side Panel:</strong> Displays Canvas Switcher alongside
              your current browser tab.
            </li>
            <li>
              <strong>Site access:</strong> Allows the extension to interact
              with supported Canvas sites hosted on{" "}
              <code className="rounded-sm bg-background px-1">
                *.instructure.com
              </code>
              .
            </li>
            <li>
              <strong>Other permissions:</strong> Are used only where necessary
              to support the extension's functionality.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="mb-2 font-extrabold">
            5. Tracking and third-party services
          </h2>
          <p>
            Canvas Switcher does not use advertising, analytics or tracking
            services. Course information accessed by the extension is not
            transmitted to third parties.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-extrabold">
            6. Your responsibility
          </h2>
          <p>
            Canvas Switcher is a navigation tool for Canvas. Users are
            responsible for maintaining the security of their own Canvas
            accounts and using the extension in accordance with their
            institution's policies and Canvas terms.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-extrabold">
            7. Disclaimer
          </h2>
          <p>
            Canvas Switcher is an independent project and is not affiliated
            with, endorsed by, or officially associated with Instructure,
            Canvas or any educational institution.
          </p>
        </section>

        <section>
          <h2 className="mb-2 font-extrabold">
            8. Contact
          </h2>
          <p>
            For privacy questions or concerns, report an issue through{" "}
            <a
              className="font-bold text-accent underline"
              href="https://github.com/PhanHoangKhang/Canvas-Switcher/issues"
              target="_blank"
              rel="noreferrer"
            >
              the Canvas Switcher project issue tracker
            </a>
            .
          </p>
        </section>
      </div>

      {isGate && (
        <div className="mt-5">
          <label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-text-primary">
            <input
              type="checkbox"
              className="mt-1 size-4 accent-accent"
              checked={checked}
              onChange={(event) => onCheckedChange(event.target.checked)}
            />
            <span>
              I have read and agree to the Terms of Use &amp; Privacy.
            </span>
          </label>

          <button
            type="button"
            disabled={!checked}
            onClick={onAgree}
            className="mt-4 w-full rounded-lg bg-accent px-4 py-3 font-extrabold text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            Agree and continue
          </button>
        </div>
      )}
    </main>
  );
}