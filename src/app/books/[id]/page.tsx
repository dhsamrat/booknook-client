"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getBookById, type Book } from "@/lib/api";

export default function BookDetailsPage() {
  const params = useParams();
  const id = params.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        setBook(response.data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load book."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading book details...</p>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          Book Not Found
        </h2>
        <p className="text-gray-600">
          {error || "This book does not exist."}
        </p>
        <Link
          href="/books"
          className="rounded-lg bg-gray-900 px-5 py-3 text-white hover:bg-gray-700"
        >
          Back to All Books
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-14">
      <div className="mx-auto max-w-6xl">
        <Link
          href="/books"
          className="mb-8 inline-block text-sm font-medium text-gray-600 hover:text-black"
        >
          ← Back to All Books
        </Link>

        <div className="grid overflow-hidden rounded-2xl bg-white shadow-sm md:grid-cols-2">
          <div className="bg-gray-100">
            <img
              src={book.image}
              alt={book.title}
              className="h-full max-h-[600px] min-h-[350px] w-full object-cover"
            />
          </div>

          <div className="flex flex-col justify-center p-7 md:p-10">
            <span className="w-fit rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-700">
              {book.category}
            </span>

            <h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
              {book.title}
            </h1>

            <p className="mt-3 text-lg text-gray-600">
              By {book.author}
            </p>

            <div className="my-7 border-t border-gray-200" />

            <h2 className="text-lg font-semibold text-gray-900">
              About This Book
            </h2>

            <p className="mt-3 leading-7 text-gray-600">
              {book.description}
            </p>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Total Copies</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {book.totalCopies}
                </p>
              </div>

              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm text-gray-500">Available Copies</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {book.availableCopies}
                </p>
              </div>
            </div>

            <div className="mt-8">
              {book.availableCopies > 0 ? (
                <Link
                  href={`/books/${book._id}/borrow`}
                  className="block rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-white transition hover:bg-gray-700"
                >
                  Borrow This Book
                </Link>
              ) : (
                <button
                  disabled
                  className="w-full cursor-not-allowed rounded-lg bg-gray-300 px-6 py-3 font-semibold text-gray-600"
                >
                  Currently Unavailable
                </button>
              )}
            </div>

            <p className="mt-5 text-sm text-gray-500">
              Added by: {book.addedBy.name}
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}