"use client";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">
          Something went wrong
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Oops!</h1>
        <p className="mt-4 max-w-md text-black/60">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-8 rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
