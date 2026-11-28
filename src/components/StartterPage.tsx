
import { RotateCw } from "lucide-react";

interface StartterPageProps {
  onReload: () => void;
}

export default function StartterPage({ onReload }: StartterPageProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 font-[Nunito]">
      <p className="text-center text-sm text-text-primary">
        Canvas session not found. Open and sign in to your Canvas site, then refresh.
      </p>

      <button
        onClick={onReload}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-accent px-4 py-3 text-sm font-bold text-white transition hover:bg-accent-hover"
      >
        Refresh
        <RotateCw size={16} />
      </button>
    </div>
  );
}
