
import { ExternalLink } from "lucide-react";

interface LoginPageProps {
  error?: string | null;
}

export default function LoginPage({ error }: LoginPageProps) {
  const handleLogin = () => {
    chrome.tabs.create({
      url: "https://rmit.instructure.com",
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 font-[Nunito]">
      <p className="text-center text-sm text-gray-500">
        Please log in to RMIT Canvas to get started.
      </p>

      {error && (
        <p className="mt-3 max-w-xs break-words text-center text-xs text-red-600">
          {error}
        </p>
      )}

      <button
        onClick={handleLogin}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-gray-900 transition hover:bg-accent-hover"
      >
        Login to Canvas
        <ExternalLink size={16} />
      </button>
    </div>
  );
}
