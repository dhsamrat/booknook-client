
"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { createBook } from "@/lib/api";

export default function AddBookPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    author: "",
    category: "Fiction",
    image: "",
    description: "",
    totalCopies: "1",
  });

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?callbackURL=/add-book");
    }
  }, [session, isPending, router]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!session?.user) return;

    const totalCopies = Number(formData.totalCopies);

    if (!Number.isInteger(totalCopies) || totalCopies < 1) {
      setError("Total copies must be a positive whole number.");
      return;
    }

    try {
      setLoading(true);

      await createBook({
        title: formData.title.trim(),
        author: formData.author.trim(),
        category: formData.category as
          | "Fiction"
          | "Science"
          | "History"
          | "Kids"
          | "Others",
        image: formData.image.trim(),
        description: formData.description.trim(),
        totalCopies,
        addedBy: {
          name: session.user.name,
          email: session.user.email,
        },
      });

      alert("Book added successfully!");
      router.push("/my-books");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to add book."
      );
    } finally {
      setLoading(false);
    }
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-12">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Add a New Book
        </h1>

        <p className="mb-8 text-gray-600">
          Add a new book to the BookNook library.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 rounded-xl border bg-white p-6 shadow-sm"
        >
          <div>
            <label className="mb-2 block font-medium">Book Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter book title"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Author</label>
            <input
              name="author"
              value={formData.author}
              onChange={handleChange}
              required
              placeholder="Enter author name"
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
              <option value="Fiction">Fiction</option>
              <option value="Science">Science</option>
              <option value="History">History</option>
              <option value="Kids">Kids</option>
              <option value="Others">Others</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Book Image URL
            </label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              required
              placeholder="https://example.com/book-image.jpg"
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={5}
              placeholder="Write a short description..."
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">Total Copies</label>
            <input
              type="number"
              name="totalCopies"
              value={formData.totalCopies}
              onChange={handleChange}
              min="1"
              step="1"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-gray-900"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-gray-900 px-5 py-3 font-semibold text-white transition hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Adding Book..." : "Add Book"}
          </button>
        </form>
      </div>
    </main>
  );
}
