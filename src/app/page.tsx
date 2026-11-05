
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getBooks, type Book } from "@/lib/api";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const slides = [
  {
    subtitle: "Discover Your Next Adventure",
    title: "A World of Stories Awaits You.",
    description:
      "Explore thousands of stories, ideas, and adventures. Find the book that inspires your next journey.",
    image:
      "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=1600",
  },
  {
    subtitle: "Read. Learn. Grow.",
    title: "Knowledge Begins With Reading.",
    description:
      "From science to history, discover books that expand your knowledge and open your mind.",
    image:
      "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=1600",
  },
  {
    subtitle: "Join Our Reading Community",
    title: "Share the Joy of Reading.",
    description:
      "Borrow your favorite books, explore new authors, and become part of our reading community.",
    image:
      "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=1600",
  },
];

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getBooks(6);
      setBooks(response.data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load books"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  return (
    <main className="min-h-screen bg-[#faf9f6]">

      {/* Hero Slider */}
      <section className="mx-auto max-w-7xl px-4 pt-8 md:px-6">
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          slidesPerView={1}
          loop
          autoplay={{
            delay: 4000,
            disableOnInteraction: false,
          }}
          pagination={{ clickable: true }}
          navigation
          className="overflow-hidden rounded-2xl"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div
                className="relative flex min-h-[480px] items-center bg-cover bg-center px-8 py-16 md:min-h-[560px] md:px-16"
                style={{
                  backgroundImage: `linear-gradient(90deg, rgba(0,0,0,0.82), rgba(0,0,0,0.25)), url('${slide.image}')`,
                }}
              >
                <div className="max-w-2xl text-white">
                  <span className="inline-block rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold">
                    {slide.subtitle}
                  </span>

                  <h1 className="mt-6 text-4xl font-bold leading-tight md:text-6xl">
                    {slide.title}
                  </h1>

                  <p className="mt-5 max-w-xl leading-8 text-gray-200 md:text-lg">
                    {slide.description}
                  </p>

                  <Link
                    href="/books"
                    className="mt-8 inline-block rounded-lg bg-emerald-700 px-7 py-4 font-semibold text-white transition hover:bg-emerald-800"
                  >
                    Explore Books
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Latest Books Section */}
      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-2 font-medium text-emerald-700">
              EXPLORE OUR COLLECTION
            </p>

            <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">
              Latest Books
            </h2>

            <p className="mt-3 text-gray-600">
              Discover the newest additions to our library.
            </p>
          </div>

          <Link
            href="/books"
            className="font-semibold text-emerald-800 hover:underline"
          >
            View All Books →
          </Link>
        </div>

        {loading && (
          <div className="flex min-h-60 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-emerald-200 border-t-emerald-800" />
          </div>
        )}

        {!loading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchBooks}
              className="mt-4 rounded-md bg-emerald-800 px-5 py-2 text-white hover:bg-emerald-900"
            >
              Try Again
            </button>
          </div>
        )}

        {!loading && !error && books.length === 0 && (
          <div className="rounded-xl border bg-white py-16 text-center">
            <h3 className="text-xl font-semibold text-gray-800">
              No books available yet
            </h3>
            <p className="mt-2 text-gray-500">
              New books will appear here when they are added.
            </p>
          </div>
        )}

        {!loading && !error && books.length > 0 && (
          <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <div
                key={book._id}
                className="overflow-hidden rounded-xl border border-gray-100 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="h-64 overflow-hidden bg-gray-100">
                  <img
                    src={book.image}
                    alt={book.title}
                    className="h-full w-full object-cover transition duration-300 hover:scale-105"
                  />
                </div>

                <div className="p-5">
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
                    {book.category}
                  </span>

                  <h3 className="mt-4 line-clamp-1 text-xl font-bold text-gray-900">
                    {book.title}
                  </h3>

                  <p className="mt-2 text-sm text-gray-500">
                    By {book.author}
                  </p>

                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-gray-600">
                    {book.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between border-t pt-4">
                    <span className="text-sm text-gray-600">
                      Available:{" "}
                      <strong className="text-emerald-800">
                        {book.availableCopies}
                      </strong>
                    </span>

                    <Link
                      href={`/books/${book._id}`}
                      className="rounded-md bg-emerald-800 px-4 py-2 text-sm font-medium text-white transition hover:bg-emerald-900"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Why Choose BookNook */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="font-semibold text-emerald-700">
              WHY BOOKNOOK?
            </p>
            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Your Reading Journey Starts Here
            </h2>
            <p className="mt-4 leading-7 text-gray-600">
              We make discovering, borrowing, and enjoying books simple.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {[
              {
                icon: "📚",
                title: "Vast Collection",
                description:
                  "Explore books from different categories, authors, and subjects.",
              },
              {
                icon: "🔖",
                title: "Easy Borrowing",
                description:
                  "Find your favorite book and borrow available copies with ease.",
              },
              {
                icon: "🌱",
                title: "Grow Your Knowledge",
                description:
                  "Discover new ideas and develop a lifelong reading habit.",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-xl border border-gray-100 bg-[#faf9f6] p-8 text-center transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="text-5xl">{item.icon}</div>
                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {item.title}
                </h3>
                <p className="mt-3 leading-7 text-gray-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reading Benefits */}
      <section className="mx-auto grid max-w-7xl items-center gap-10 px-6 py-20 md:grid-cols-2">
        <div>
          <p className="font-semibold text-emerald-700">
            BUILD A BETTER HABIT
          </p>

          <h2 className="mt-3 text-3xl font-bold leading-tight text-gray-900 md:text-4xl">
            A Little Reading Every Day Makes a Big Difference.
          </h2>

          <p className="mt-5 leading-8 text-gray-600">
            Reading helps you discover new perspectives, improve your
            imagination, build vocabulary, and understand the world around you.
            Start with one book and make reading part of your daily life.
          </p>

          <Link
            href="/books"
            className="mt-7 inline-block rounded-lg bg-emerald-800 px-7 py-3 font-semibold text-white transition hover:bg-emerald-900"
          >
            Start Reading
          </Link>
        </div>

        <div className="overflow-hidden rounded-2xl">
          <img
            src="https://images.unsplash.com/photo-1519682337058-a94d519337bc?w=1000"
            alt="Books and reading"
            className="h-[350px] w-full object-cover"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white px-6 py-8 text-center text-sm text-gray-500">
        <p className="text-xl font-bold text-emerald-800">
          BookNook<span className="text-amber-500">.</span>
        </p>
        <p className="mt-2">
          © 2026 BookNook. Made for people who love reading.
        </p>
      </footer>
    </main>
  );
}
