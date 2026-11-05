
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[80vh] items-center justify-center bg-[#faf9f6] px-6">
      <div className="max-w-lg text-center">
        <h1 className="text-8xl font-bold text-emerald-800">404</h1>

        <h2 className="mt-5 text-3xl font-bold text-gray-900">
          Oops! Page Not Found
        </h2>

        <p className="mt-4 leading-7 text-gray-600">
          The page you are looking for might have been removed,
          renamed, or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="mt-8 inline-block rounded-lg bg-emerald-800 px-7 py-3 font-semibold text-white transition hover:bg-emerald-900"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
