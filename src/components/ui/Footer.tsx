
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t bg-white text-gray-600">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">

          {/* Brand */}
          <div>
            <Link
              href="/"
              className="mb-4 flex items-center gap-2 text-2xl font-bold text-gray-900"
            >
              <span className="text-3xl text-blue-600">📚</span>
              BookNook
            </Link>

            <p className="max-w-xs text-sm leading-6">
              Discover, borrow, and enjoy your favorite books.
              Your next great read starts here.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">
              Quick Links
            </h3>

            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-blue-600">Home</Link></li>
              <li><Link href="/books" className="hover:text-blue-600">All Books</Link></li>
              <li><Link href="/add-book" className="hover:text-blue-600">Add Book</Link></li>
              <li><Link href="/my-books" className="hover:text-blue-600">My Books</Link></li>
              <li><Link href="/my-borrows" className="hover:text-blue-600">My Borrows</Link></li>
            </ul>
          </div>

          {/* Explore */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">
              Explore
            </h3>

            <ul className="space-y-3 text-sm">
              <li>Fiction</li>
              <li>Science</li>
              <li>History</li>
              <li>Kids</li>
              <li>Others</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="mb-4 font-semibold text-gray-900">
              Connect With Us
            </h3>

            <div className="space-y-4 text-sm">
              <a
                href="mailto:contact@booknook.com"
                className="flex items-center gap-2 hover:text-blue-600"
              >
                <span>✉️</span>
                contact@booknook.com
              </a>

              <a
                href="https://github.com"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 hover:text-blue-600"
              >
                <span>💻</span>
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 border-t pt-6 text-center text-sm">
          <p>
            © {new Date().getFullYear()} BookNook. All rights reserved.
          </p>
          <p className="mt-2 text-gray-400">
            Made with love for book lovers.
          </p>
        </div>
      </div>
    </footer>
  );
}
