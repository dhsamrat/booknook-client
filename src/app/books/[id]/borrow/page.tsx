"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { borrowBook, getBookById, type Book } from "@/lib/api";

export default function BorrowPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session, isPending } = useSession();

  const [book, setBook] = useState<Book | null>(null);
  const [borrowDate, setBorrowDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;

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

    fetchBook();
  }, [id]);

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?callbackURL=/books/${id}/borrow`);
    }
  }, [isPending, session, router, id]);

  const handleBorrow = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!session?.user) {
      setError("Please login first.");
      return;
    }

    if (!borrowDate || !returnDate) {
      setError("Please select both dates.");
      return;
    }

    if (returnDate <= borrowDate) {
      setError("Return date must be after borrow date.");
      return;
    }

    try {
      setSubmitting(true);

      await borrowBook({
        bookId: book!._id,
        userName: session.user.name,
        userEmail: session.user.email,
        borrowDate,
        returnDate,
      });

      alert("Book borrowed successfully!");
      router.push("/my-borrows");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to borrow book."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!session) return null;

  if (!book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <p>{error || "Book not found."}</p>
        <Link href="/books" className="text-blue-600 underline">
          Back to Books
        </Link>
      </div>
    );
  }

  if (book.availableCopies <= 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4">
        <h2 className="text-2xl font-bold">Book Unavailable</h2>
        <p>There are currently no available copies.</p>
        <Link href="/books" className="text-blue-600 underline">
          Back to Books
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-bold text-gray-900">
          Borrow Book
        </h1>

        <p className="mt-2 text-gray-600">
          Complete the form to borrow this book.
        </p>

        <div className="my-6 rounded-lg bg-gray-50 p-4">
          <h2 className="font-semibold">{book.title}</h2>
          <p className="text-sm text-gray-600">By {book.author}</p>
          <p className="mt-2 text-sm text-gray-600">
            Available Copies: {book.availableCopies}
          </p>
        </div>

        <form onSubmit={handleBorrow} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">Your Name</label>
            <input
              type="text"
              value={session.user.name}
              readOnly
              className="w-full rounded-lg border bg-gray-100 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Your Email</label>
            <input
              type="email"
              value={session.user.email}
              readOnly
              className="w-full rounded-lg border bg-gray-100 px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Borrow Date</label>
            <input
              type="date"
              required
              min={new Date().toISOString().split("T")[0]}
              value={borrowDate}
              onChange={(e) => setBorrowDate(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Return Date</label>
            <input
              type="date"
              required
              min={borrowDate || new Date().toISOString().split("T")[0]}
              value={returnDate}
              onChange={(e) => setReturnDate(e.target.value)}
              className="w-full rounded-lg border px-4 py-3"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
          >
            {submitting ? "Processing..." : "Confirm Borrow"}
          </button>
        </form>
      </div>
    </main>
  );
}