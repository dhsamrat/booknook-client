
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
      <div className="flex min-h-screen items-center justify-center">
        Loading book information...
      </div>
    );
  }

  if (!session) return null;

  if (error && !book) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-5">
        <p className="text-center text-red-600">{error}</p>
        <Link
          href="/my-books"
          className="rounded-lg bg-gray-900 px-5 py-3 text-white"
        >
          Back to My Books
        </Link>
      </div>
    );
  }

  if (!book) return null;

  return (
    <main className="min-h-screen bg-[#faf9f6] px-5 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-7 shadow-sm md:p-10">
        <h1 className="text-3xl font-bold text-gray-900">
          Edit Book
        </h1>

        <p className="mt-2 text-gray-600">
          Update your book information.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="mb-2 block font-medium">Book Title</label>
            <input
              name="title"
              type="text"
              required
              value={formData.title}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Author</label>
            <input
              name="author"
              type="text"
              required
              value={formData.author}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Category</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">Image URL</label>
            <input
              name="image"
              type="url"
              required
              value={formData.image}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>
            <textarea
              name="description"
              required
              rows={5}
              value={formData.description}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Total Copies
            </label>
            <input
              name="totalCopies"
              type="number"
              min="1"
              step="1"
              required
              value={formData.totalCopies}
              onChange={handleChange}
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
            <p className="mt-2 text-xs text-gray-500">
              Current available copies: {book.availableCopies}
            </p>
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 rounded-lg bg-gray-900 px-6 py-3 font-semibold text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {submitting ? "Updating..." : "Update Book"}
            </button>

            <Link
              href="/my-books"
              className="flex-1 rounded-lg border border-gray-300 px-6 py-3 text-center font-semibold text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
