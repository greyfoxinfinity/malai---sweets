import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#8b5e3c]">
          404
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight">Page not found</h1>
        <p className="mt-4 max-w-md text-black/60">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-black px-6 py-3 text-sm font-medium text-white"
        >
          Go home
        </Link>
      </div>
    </main>
  );
}
