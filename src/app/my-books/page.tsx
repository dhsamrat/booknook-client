
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  deleteBook,
  getBooks,
  type Book,
} from "@/lib/api";

export default function MyBooksPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login?callbackURL=/my-books");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    const fetchMyBooks = async () => {
      try {
        setLoading(true);

        const response = await getBooks();

        const myBooks = response.data.filter(
          (book) =>
            book.addedBy.email.toLowerCase() ===
            session.user.email.toLowerCase()
        );

        setBooks(myBooks);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to load books.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMyBooks();
  }, [isPending, session]);

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this book?"
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      await deleteBook(id);

      setBooks((previous) =>
        previous.filter((book) => book._id !== id)
      );

      toast.success("Book deleted successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to delete book.";

      setError(message);
      toast.error(message);
    } finally {
      setDeletingId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading your books...
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
              My Books
            </h1>
            <p className="mt-3 text-gray-600">
              Manage the books you have added to BookNook.
            </p>
          </div>

          <Link
            href="/add-book"
            className="rounded-lg bg-gray-900 px-6 py-3 text-center font-semibold text-white hover:bg-gray-700"
          >
            + Add New Book
          </Link>
        </div>

        {error && (
          <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </p>
        )}

        {books.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              You Haven't Added Any Books
            </h2>

            <p className="mt-3 text-gray-600">
              Add your first book to the library.
            </p>

            <Link
              href="/add-book"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-700"
            >
              Add a Book
            </Link>
          </div>
        ) : (
          <>
            <p className="mb-5 text-gray-600">
              Your books: {books.length}
            </p>

            <div className="grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {books.map((book) => (
                <div
                  key={book._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                >
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-56 w-full object-cover"
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

                    <p className="mt-4 text-sm text-gray-600">
                      Total Copies: {book.totalCopies}
                    </p>

                    <p className="text-sm text-gray-600">
                      Available Copies: {book.availableCopies}
                    </p>

                    <div className="mt-5 flex gap-3">
                      <Link
                        href={`/edit-book/${book._id}`}
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-center text-sm font-medium text-gray-800 hover:bg-gray-100"
                      >
                        Edit
                      </Link>

                      <button
                        onClick={() => handleDelete(book._id)}
                        disabled={deletingId === book._id}
                        className="flex-1 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
                      >
                        {deletingId === book._id
                          ? "Deleting..."
                          : "Delete"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
