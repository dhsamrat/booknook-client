
export default function Loading() {
  return (
    <main className="flex min-h-[70vh] items-center justify-center bg-[#faf9f6]">
      <div className="text-center">
        <div className="mx-auto h-14 w-14 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-800" />

        <h2 className="mt-5 text-xl font-semibold text-gray-900">
          Loading BookNook...
        </h2>

        <p className="mt-2 text-sm text-gray-500">
          Please wait while we prepare your reading experience.
        </p>
      </div>
    </main>
  );
}
