
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { getBooks, type Book } from "@/lib/api";

const categories = ["All", "Fiction", "Science", "History", "Kids", "Others"];

export default function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getBooks();
        setBooks(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load books."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const matchesSearch =
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        category === "All" || book.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [books, search, category]);

  return (
    <main className="min-h-screen overflow-hidden bg-[#faf9f6] px-4 py-10 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl">

        {/* Page Heading */}
        <div className="mb-8 text-center sm:mb-10">
          <p className="mb-2 text-sm font-semibold tracking-wider text-emerald-700">
            OUR COLLECTION
          </p>

          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Explore All Books
          </h1>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-gray-600 sm:text-base">
            Discover your next favorite book from our collection.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mx-auto mb-8 grid max-w-4xl grid-cols-1 gap-3 sm:mb-10 sm:grid-cols-[1fr_200px] sm:gap-4">
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full min-w-0 rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:text-base"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-emerald-700 focus:ring-2 focus:ring-emerald-100 sm:text-base"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex min-h-60 flex-col items-center justify-center gap-4">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-800" />
            <p className="text-sm text-gray-600">Loading books...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-10 text-center">
            <p className="text-sm text-red-600 sm:text-base">{error}</p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg bg-emerald-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-900"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Books */}
        {!loading && !error && (
          <>
            <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
              <p className="text-sm text-gray-600 sm:text-base">
                Showing{" "}
                <strong className="text-gray-900">
                  {filteredBooks.length}
                </strong>{" "}
                of {books.length} books
              </p>

              {(search || category !== "All") && (
                <button
                  onClick={() => {
                    setSearch("");
                    setCategory("All");
                  }}
                  className="text-sm font-medium text-emerald-800 hover:underline"
                >
                  Clear Filters
                </button>
              )}
            </div>

            {filteredBooks.length === 0 ? (
              <div className="rounded-xl border bg-white px-4 py-12 text-center sm:py-16">
                <div className="mb-3 text-4xl">📚</div>

                <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
                  No books found
                </h2>

                <p className="mt-2 text-sm text-gray-500">
                  Try another search or category.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:gap-7">
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                  >
                    {/* Book Image */}
                    <div className="h-56 overflow-hidden bg-gray-100 sm:h-64">
                      <img
                        src={book.image}
                        alt={book.title}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-300 hover:scale-105"
                      />
                    </div>

                    {/* Book Information */}
                    <div className="p-4 sm:p-5">
                      <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                        {book.category}
                      </span>

                      <h2 className="mt-4 line-clamp-1 text-lg font-bold text-gray-900 sm:text-xl">
                        {book.title}
                      </h2>

                      <p className="mt-2 text-sm text-gray-600">
                        By {book.author}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                        {book.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                        <p className="text-xs font-medium text-gray-700 sm:text-sm">
                          Available Copies:{" "}
                          <span className="text-emerald-800">
                            {book.availableCopies}
                          </span>
                        </p>
                      </div>

                      <Link
                        href={`/books/${book._id}`}
                        className="mt-4 block w-full rounded-lg bg-emerald-800 px-4 py-3 text-center text-sm font-semibold text-white transition hover:bg-emerald-900"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </main>
  );
}
