
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[#faf9f6]">

      {/* Navbar */}
      <nav className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">

          <Link href="/" className="text-2xl font-bold text-emerald-800">
            BookNook<span className="text-amber-500">.</span>
          </Link>

          <div className="hidden items-center gap-7 text-sm font-medium md:flex">
            <Link href="/" className="text-emerald-700">
              Home
            </Link>
            <Link href="/books" className="text-gray-600 hover:text-emerald-700">
              All Books
            </Link>
            <Link href="/login" className="text-gray-600 hover:text-emerald-700">
              Login
            </Link>
          </div>

          <Button className="bg-emerald-800 hover:bg-emerald-900">
            Get Started
          </Button>

        </div>
      </nav>

      {/* Hero Section */}
      <section className="mx-auto flex min-h-[75vh] max-w-7xl flex-col items-center justify-center px-6 text-center">

        <span className="mb-5 rounded-full bg-emerald-100 px-5 py-2 text-sm font-medium text-emerald-800">
          Welcome to BookNook Library
        </span>

        <h1 className="max-w-3xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
          Every Book Opens a
          <span className="text-emerald-700"> New World.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-8 text-gray-600 md:text-lg">
          Discover your next favorite book, explore new ideas,
          and share the joy of reading with our community.
        </p>

        <div className="mt-9 flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-emerald-800 px-7 py-6 hover:bg-emerald-900">
            <Link href="/books">
              Explore Books
            </Link>
          </Button>

          <Button asChild variant="outline" className="px-7 py-6">
            <Link href="/register">
              Join Our Community
            </Link>
          </Button>
        </div>

      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-gray-500">
        © 2026 BookNook. Made for people who love reading.
      </footer>

    </main>
  );
}
