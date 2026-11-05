
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import { getBorrows, returnBook, type Borrow } from "@/lib/api";

export default function MyBorrowsPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [borrows, setBorrows] = useState<Borrow[]>([]);
  const [loading, setLoading] = useState(true);
  const [returningId, setReturningId] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login?callbackURL=/my-borrows");
    }
  }, [isPending, session, router]);

  useEffect(() => {
    if (isPending || !session?.user?.email) return;

    const fetchBorrows = async () => {
      try {
        setLoading(true);
        const response = await getBorrows(session.user.email);
        setBorrows(response.data);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Failed to load borrow records.";

        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    };

    fetchBorrows();
  }, [isPending, session]);

  const handleReturn = async (id: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to return this book?"
    );

    if (!confirmed) return;

    try {
      setReturningId(id);
      setError("");

      await returnBook(id);

      setBorrows((previous) =>
        previous.filter((borrow) => borrow._id !== id)
      );

      toast.success("Book returned successfully!");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to return book.";

      setError(message);
      toast.error(message);
    } finally {
      setReturningId(null);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          <p className="text-sm font-medium text-gray-600">
            Loading your borrowed books...
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Page Header */}
        <div className="mb-8 sm:mb-10">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-700">
            Your Reading Activity
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            My Borrowed Books
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600 sm:text-base">
            Manage your borrowed books and return them when finished.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <p className="mb-6 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600 sm:p-4">
            {error}
          </p>
        )}

        {/* Empty State */}
        {borrows.length === 0 ? (
          <div className="rounded-xl border border-gray-200 bg-white px-5 py-12 text-center shadow-sm sm:px-8 sm:py-16">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50 text-3xl">
              📚
            </div>

            <h2 className="text-lg font-semibold text-gray-800 sm:text-xl">
              No Borrowed Books Yet
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-600 sm:text-base">
              You have not borrowed any books. Explore our library and find your next read.
            </p>

            <Link
              href="/books"
              className="mt-6 inline-flex rounded-lg bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
            >
              Explore Books
            </Link>
          </div>
        ) : (
          <>
            {/* Borrow Count */}
            <div className="mb-5">
              <p className="text-sm font-medium text-gray-600 sm:text-base">
                Currently borrowed:{" "}
                <span className="font-bold text-gray-900">
                  {borrows.length}
                </span>
              </p>
            </div>

            {/* Mobile & Tablet Card Layout */}
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:hidden">
              {borrows.map((borrow) => (
                <div
                  key={borrow._id}
                  className="overflow-hidden rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-5"
                >
                  <div className="flex gap-4">
                    <img
                      src={borrow.bookImage}
                      alt={borrow.bookTitle}
                      className="h-28 w-20 shrink-0 rounded-lg bg-gray-100 object-cover sm:h-32 sm:w-24"
                    />

                    <div className="min-w-0 flex-1">
                      <h2 className="break-words text-base font-bold leading-snug text-gray-900 sm:text-lg">
                        {borrow.bookTitle}
                      </h2>

                      <p className="mt-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                        Borrowed Book
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 space-y-3 rounded-lg bg-gray-50 p-3">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-gray-600">
                        Borrow Date
                      </span>
                      <span className="font-medium text-gray-900">
                        {borrow.borrowDate}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="text-gray-600">
                        Return Date
                      </span>
                      <span className="font-medium text-gray-900">
                        {borrow.returnDate}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleReturn(borrow._id)}
                    disabled={returningId === borrow._id}
                    className="mt-4 w-full rounded-lg bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {returningId === borrow._id
                      ? "Returning..."
                      : "Return Book"}
                  </button>
                </div>
              ))}
            </div>

            {/* Desktop Table Layout */}
            <div className="hidden overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm lg:block">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-gray-100 text-sm text-gray-700">
                    <tr>
                      <th className="px-6 py-5 font-semibold">
                        Book
                      </th>
                      <th className="px-6 py-5 font-semibold">
                        Borrow Date
                      </th>
                      <th className="px-6 py-5 font-semibold">
                        Return Date
                      </th>
                      <th className="px-6 py-5 font-semibold">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {borrows.map((borrow) => (
                      <tr
                        key={borrow._id}
                        className="border-t border-gray-100 transition hover:bg-gray-50"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={borrow.bookImage}
                              alt={borrow.bookTitle}
                              className="h-16 w-12 rounded-lg bg-gray-100 object-cover"
                            />

                            <span className="max-w-xs font-semibold text-gray-800">
                              {borrow.bookTitle}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {borrow.borrowDate}
                        </td>

                        <td className="px-6 py-4 text-sm text-gray-600">
                          {borrow.returnDate}
                        </td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleReturn(borrow._id)}
                            disabled={returningId === borrow._id}
                            className="whitespace-nowrap rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {returningId === borrow._id
                              ? "Returning..."
                              : "Return Book"}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
