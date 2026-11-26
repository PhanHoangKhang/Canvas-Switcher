
interface Props {
  progress: number;
  message: string;
}

export default function LoadingPage({ progress, message }: Props) {
  const clampedProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-8 font-[Nunito]">
      <div className="w-full max-w-xs">
        <div className="mb-3 flex items-center justify-between text-sm">
          <p className="font-medium text-text-primary">Preparing Canvas</p>
          <span className="font-semibold text-accent">{clampedProgress}%</span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-surface"
          role="progressbar"
          aria-label="Loading course data"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={clampedProgress}
        >
          <div
            className="h-full rounded-full bg-accent transition-[width] duration-300"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>

        <p className="mt-3 text-center text-xs text-text-secondary">{message}</p>
      </div>
    </div>
  );
}
