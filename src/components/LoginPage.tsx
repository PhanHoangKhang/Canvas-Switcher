
import { ExternalLink } from "lucide-react";

export default function LoginPage() {
  const handleLogin = () => {
    chrome.tabs.create({
      url: "https://rmit.instructure.com",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 font-[Nunito]">
      <p className="text-center text-sm text-text-primary">
        Sign in to Canvas to continue using Canvas Switcher.
      </p>

      <button
        onClick={handleLogin}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
      >
        Login to Canvas
        <ExternalLink size={16} />
      </button>
    </div>
  );
}
