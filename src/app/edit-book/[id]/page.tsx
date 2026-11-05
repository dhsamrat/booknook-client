
"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useSession } from "@/lib/auth-client";
import {
  getBookById,
  updateBook,
  type Book,
} from "@/lib/api";

const categories = [
  "Fiction",
  "Science",
  "History",
  "Kids",
  "Others",
] as const;

export default function EditBookPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const { data: session, isPending } = useSession();

  const [book, setBook] = useState<Book | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: "1",
  });

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isPending && !session) {
      router.replace(`/login?callbackURL=/edit-book/${id}`);
    }
  }, [isPending, session, router, id]);

  useEffect(() => {
    if (!id || isPending || !session?.user?.email) return;

    const fetchBook = async () => {
      try {
        const response = await getBookById(id);
        const data = response.data;

        if (
          data.addedBy.email.toLowerCase() !==
          session.user.email.toLowerCase()
        ) {
          setError("You are not allowed to edit this book.");
          return;
        }

        setBook(data);

        setFormData({
          title: data.title,
          author: data.author,
          category: data.category,
          image: data.image,
          description: data.description,
          totalCopies: String(data.totalCopies),
        });
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load book."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id, isPending, session]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const totalCopies = Number(formData.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      const message = "Total copies must be a positive whole number.";
      setError(message);
      toast.error(message);
      return;
    }

    if (!book) return;

    try {
      setSubmitting(true);

      await updateBook(id, {
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category as Book["category"],
        image: formData.image.trim(),
        description: formData.description.trim(),
        totalCopies,
      });

      toast.success("Book updated successfully!");

      router.push("/my-books");
      router.refresh();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to update book.";

      setError(message);
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (isPending || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf9f6] px-4">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" />
          <p className="text-sm font-medium text-gray-600">
            Loading book information...
          </p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  if (error && !book) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#faf9f6] gap-4 px-4">
        <p className="max-w-md text-center text-sm leading-6 text-red-600 sm:text-base">
          {error}
        </p>

        <Link
          href="/my-books"
          className="rounded-lg bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-gray-700"
        >
          Back to My Books
        </Link>
      </main>
    );
  }

  if (!book) return null;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
      <div className="mx-auto w-full max-w-2xl">

        {/* Heading */}
        <div className="mb-6 text-center sm:mb-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-amber-700">
            Manage Your Collection
          </p>

          <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl md:text-4xl">
            Edit Book
          </h1>

          <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-base">
            Update your book information.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:rounded-2xl sm:p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6">

            {/* Book Title */}
            <div>
              <label
                htmlFor="title"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Book Title
              </label>

              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                placeholder="Enter book title"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Author */}
            <div>
              <label
                htmlFor="author"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Author
              </label>

              <input
                id="author"
                name="author"
                type="text"
                required
                value={formData.author}
                onChange={handleChange}
                placeholder="Enter author name"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Category */}
            <div>
              <label
                htmlFor="category"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Category
              </label>

              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Image URL */}
            <div>
              <label
                htmlFor="image"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Image URL
              </label>

              <input
                id="image"
                name="image"
                type="url"
                required
                value={formData.image}
                onChange={handleChange}
                placeholder="Enter book image URL"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Description
              </label>

              <textarea
                id="description"
                name="description"
                required
                rows={5}
                value={formData.description}
                onChange={handleChange}
                placeholder="Write a short description..."
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-3 text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />
            </div>

            {/* Total Copies */}
            <div>
              <label
                htmlFor="totalCopies"
                className="mb-2 block text-sm font-semibold text-gray-800"
              >
                Total Copies
              </label>

              <input
                id="totalCopies"
                name="totalCopies"
                type="number"
                min="1"
                step="1"
                required
                value={formData.totalCopies}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm text-gray-900 outline-none transition focus:border-gray-900 focus:ring-2 focus:ring-gray-900/10"
              />

              <p className="mt-2 text-xs text-gray-500">
                Current available copies:{" "}
                <span className="font-semibold text-green-700">
                  {book.availableCopies}
                </span>
              </p>
            </div>

            {/* Error */}
            {error && (
              <p className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full rounded-lg bg-gray-900 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
              >
                {submitting ? "Updating..." : "Update Book"}
              </button>

              <Link
                href="/my-books"
                className="flex w-full items-center justify-center rounded-lg border border-gray-300 px-6 py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 sm:text-base"
              >
                Cancel
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
