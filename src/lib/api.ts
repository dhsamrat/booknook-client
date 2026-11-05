
import { authClient } from "@/lib/auth-client";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

// Common API response type
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Book type
export interface Book {
  _id: string;
  title: string;
  author: string;
  category: "Fiction" | "Science" | "History" | "Kids" | "Others";
  image: string;
  description: string;
  totalCopies: number;
  availableCopies: number;
  addedBy: {
    name: string;
    email: string;
  };
  createdAt: string;
}

// Borrow type
export interface Borrow {
  _id: string;
  bookId: string;
  bookTitle: string;
  bookImage: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
  createdAt: string;
}

// Common fetch function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method || "GET").toUpperCase();

  const requiresAuth =
    endpoint.startsWith("/borrows") ||
    (endpoint.startsWith("/books") && method !== "GET");

  const headers = new Headers(options.headers);

  if (options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  // Attach JWT only to protected requests
  if (requiresAuth) {
    const { data, error } = await authClient.token();

    if (error || !data?.token) {
      throw new Error("Please login to continue.");
    }

    headers.set("Authorization", `Bearer ${data.token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers,
  });

  const result = await response.json();

  if (!response.ok || result.success === false) {
    throw new Error(
      result.message || "Something went wrong"
    );
  }

  return result;
}

// =========================
// BOOK APIs
// =========================

// Get all books
export const getBooks = async (limit?: number) => {
  const query = limit ? `?limit=${limit}` : "";

  return apiRequest<ApiResponse<Book[]>>(`/books${query}`);
};

// Get single book
export const getBookById = async (id: string) => {
  return apiRequest<ApiResponse<Book>>(`/books/${id}`);
};

// Add new book
export const createBook = async (
  bookData: Omit<Book, "_id" | "availableCopies" | "createdAt">
) => {
  return apiRequest<ApiResponse<Book>>("/books", {
    method: "POST",
    body: JSON.stringify(bookData),
  });
};

// Update book
export const updateBook = async (
  id: string,
  updateData: Partial<Book>
) => {
  return apiRequest<ApiResponse<{ modifiedCount: number }>>(
    `/books/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(updateData),
    }
  );
};

// Delete book
export const deleteBook = async (id: string) => {
  return apiRequest<ApiResponse<null>>(`/books/${id}`, {
    method: "DELETE",
  });
};

// =========================
// BORROW APIs
// =========================

// Borrow a book
export const borrowBook = async (borrowData: {
  bookId: string;
  userName: string;
  userEmail: string;
  borrowDate: string;
  returnDate: string;
}) => {
  return apiRequest<ApiResponse<Borrow>>("/borrows", {
    method: "POST",
    body: JSON.stringify(borrowData),
  });
};

// Get borrow records
export const getBorrows = async (email?: string) => {
  const query = email
    ? `?email=${encodeURIComponent(email)}`
    : "";

  return apiRequest<ApiResponse<Borrow[]>>(`/borrows${query}`);
};

// Return a borrowed book
export const returnBook = async (id: string) => {
  return apiRequest<ApiResponse<null>>(`/borrows/${id}`, {
    method: "DELETE",
  });
};
