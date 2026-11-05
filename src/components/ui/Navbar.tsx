
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    await signOut();
    setMenuOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <Link href="/" className="text-2xl font-bold text-gray-900">
          Book<span className="text-blue-600">Nook</span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link href="/" className="text-gray-700 hover:text-blue-600">
            Home
          </Link>
          <Link href="/books" className="text-gray-700 hover:text-blue-600">
            All Books
          </Link>

          {!isPending && session && (
            <>
              <Link href="/add-book" className="text-gray-700 hover:text-blue-600">
                Add Book
              </Link>
              <Link href="/my-books" className="text-gray-700 hover:text-blue-600">
                My Books
              </Link>
              <Link href="/my-borrows" className="text-gray-700 hover:text-blue-600">
                My Borrows
              </Link>
            </>
          )}
        </div>

        <div className="relative flex items-center gap-3">
          {isPending ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : session ? (
            <>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700"
                aria-label="Open profile menu"
              >
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 rounded-lg border bg-white p-2 shadow-lg">
                  <p className="border-b px-3 py-2 text-sm font-medium text-gray-700">
                    {session.user.name}
                  </p>
                  <Link
                    href="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="block rounded-md px-3 py-2 text-sm hover:bg-gray-100"
                  >
                    My Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </nav>

      {session && (
        <div className="flex flex-wrap justify-center gap-4 border-t px-3 py-3 text-sm md:hidden">
          <Link href="/add-book">Add Book</Link>
          <Link href="/my-books">My Books</Link>
          <Link href="/my-borrows">My Borrows</Link>
        </div>
      )}
    </header>
  );
}
