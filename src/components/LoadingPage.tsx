
export default function LoadingPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center font-[Nunito]">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#ffe45c]" />

      <p className="mt-4 text-sm font-medium text-gray-500">
        Checking your Canvas session...
      </p>
    </div>
  );
}
