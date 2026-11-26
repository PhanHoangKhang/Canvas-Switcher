
import { RefreshCw } from "lucide-react";

interface RefreshButtonProps {
  onClick: () => void;
  isLoading?: boolean;
}

export default function RefreshButton({
  onClick,
  isLoading = false,
}: RefreshButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title="Refresh"
      aria-label="Refresh"
      className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition hover:bg-gray-100 hover:text-gray-900 disabled:opacity-50"
    >
      <RefreshCw
        size={16}
        className={isLoading ? "animate-spin" : ""}
      />
    </button>
  );
}
