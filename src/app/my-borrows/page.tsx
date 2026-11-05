
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
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-600">Loading your borrowed books...</p>
      </div>
    );
  }

  if (!session) return null;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
            My Borrowed Books
          </h1>

          <p className="mt-3 text-gray-600">
            Manage your borrowed books and return them when finished.
          </p>
        </div>

        {error && (
          <p className="mb-6 rounded-lg bg-red-50 p-4 text-red-600">
            {error}
          </p>
        )}

        {borrows.length === 0 ? (
          <div className="rounded-xl bg-white p-12 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Borrowed Books Yet
            </h2>

            <p className="mt-3 text-gray-600">
              You have not borrowed any books.
            </p>

            <Link
              href="/books"
              className="mt-6 inline-block rounded-lg bg-gray-900 px-6 py-3 text-white hover:bg-gray-700"
            >
              Explore Books
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl bg-white shadow-sm">
            <table className="w-full min-w-[750px] text-left">
              <thead className="bg-gray-100 text-sm text-gray-700">
                <tr>
                  <th className="px-6 py-4">Book</th>
                  <th className="px-6 py-4">Borrow Date</th>
                  <th className="px-6 py-4">Return Date</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>

              <tbody>
                {borrows.map((borrow) => (
                  <tr
                    key={borrow._id}
                    className="border-t border-gray-100"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img
                          src={borrow.bookImage}
                          alt={borrow.bookTitle}
                          className="h-16 w-12 rounded object-cover"
                        />

                        <span className="font-semibold text-gray-800">
                          {borrow.bookTitle}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {borrow.borrowDate}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {borrow.returnDate}
                    </td>

                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleReturn(borrow._id)}
                        disabled={returningId === borrow._id}
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 disabled:opacity-50"
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
        )}
      </div>
    </main>
  );
}
