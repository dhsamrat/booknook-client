"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useSession, signOut } from "@/lib/auth-client";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const closeMenus = () => {
    setMenuOpen(false);
    setProfileOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    closeMenus();
    router.push("/");
    router.refresh();
  };

  const linkClass =
    "block rounded-lg px-3 py-2 text-gray-700 transition hover:bg-blue-50 hover:text-blue-600";

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        {/* Logo */}
        <Link
          href="/"
          onClick={closeMenus}
          className="text-2xl font-bold text-gray-900"
        >
          Book<span className="text-blue-600">Nook</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-5 lg:flex">
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

        {/* Right Side */}
        <div className="flex items-center gap-3">
          {isPending ? (
            <span className="text-sm text-gray-500">Loading...</span>
          ) : session ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-700 hover:bg-blue-200"
                aria-label="Open profile menu"
                aria-expanded={profileOpen}
              >
                {session.user.name?.charAt(0).toUpperCase() || "U"}
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border bg-white p-2 shadow-lg">
                  <p className="truncate border-b px-3 py-2 text-sm font-semibold text-gray-700">
                    {session.user.name}
                  </p>

                  <Link
                    href="/profile"
                    onClick={closeMenus}
                    className={linkClass}
                  >
                    My Profile
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
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
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border text-xl text-gray-700 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={menuOpen}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </nav>

      {/* Mobile Navigation */}
      {menuOpen && (
        <div className="border-t bg-white px-4 py-4 shadow-md lg:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2">
            <Link href="/" onClick={closeMenus} className={linkClass}>
              Home
            </Link>

            <Link href="/books" onClick={closeMenus} className={linkClass}>
              All Books
            </Link>

            {!isPending && session ? (
              <>
                <Link href="/add-book" onClick={closeMenus} className={linkClass}>
                  Add Book
                </Link>

                <Link href="/my-books" onClick={closeMenus} className={linkClass}>
                  My Books
                </Link>

                <Link href="/my-borrows" onClick={closeMenus} className={linkClass}>
                  My Borrows
                </Link>

                <Link href="/profile" onClick={closeMenus} className={linkClass}>
                  My Profile
                </Link>

                <button
                  onClick={handleLogout}
                  className="rounded-lg px-3 py-2 text-left text-red-600 hover:bg-red-50"
                >
                  Logout
                </button>
              </>
            ) : !isPending ? (
              <div className="flex gap-2 border-t pt-3 sm:hidden">
                <Link
                  href="/login"
                  onClick={closeMenus}
                  className="flex-1 rounded-lg border px-4 py-2 text-center font-medium"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  onClick={closeMenus}
                  className="flex-1 rounded-lg bg-gray-900 px-4 py-2 text-center font-medium text-white"
                >
                  Register
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </header>
  );
}