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
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold text-gray-900">
            Explore All Books
          </h1>
          <p className="mt-3 text-gray-600">
            Discover your next favorite book from our collection.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-10 flex flex-col gap-4 sm:flex-row">
          <input
            type="text"
            placeholder="Search by book title or author..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
          />

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-900"
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
          <p className="py-16 text-center text-gray-600">
            Loading books...
          </p>
        )}

        {/* Error */}
        {!loading && error && (
          <p className="py-16 text-center text-red-600">{error}</p>
        )}

        {/* Books */}
        {!loading && !error && (
          <>
            <p className="mb-5 text-gray-600">
              Showing {filteredBooks.length} of {books.length} books
            </p>

            {filteredBooks.length === 0 ? (
              <p className="py-16 text-center text-gray-600">
                No books found. Try another search or category.
              </p>
            ) : (
              <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
                {filteredBooks.map((book) => (
                  <div
                    key={book._id}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <img
                      src={book.image}
                      alt={book.title}
                      className="h-64 w-full object-cover"
                    />

                    <div className="p-5">
                      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-gray-700">
                        {book.category}
                      </span>

                      <h2 className="mt-4 text-xl font-bold text-gray-900">
                        {book.title}
                      </h2>

                      <p className="mt-1 text-sm text-gray-600">
                        By {book.author}
                      </p>

                      <p className="mt-3 line-clamp-2 text-sm text-gray-600">
                        {book.description}
                      </p>

                      <p className="mt-4 text-sm font-medium text-gray-700">
                        Available Copies: {book.availableCopies}
                      </p>

                      <Link
                        href={`/books/${book._id}`}
                        className="mt-5 block rounded-lg bg-gray-900 px-4 py-3 text-center font-medium text-white transition hover:bg-gray-700"
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