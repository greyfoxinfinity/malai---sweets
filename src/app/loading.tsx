export default function Loading() {
  return (
    <main className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-black/10 border-t-[#8b5e3c]" />
        <p className="mt-4 text-sm text-black/50">Loading...</p>
      </div>
    </main>
  );
}
