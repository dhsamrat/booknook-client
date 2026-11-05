
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login?callbackURL=/profile");
    }
  }, [session, isPending, router]);

  const handleLogout = async () => {
    await signOut();
    router.push("/login");
    router.refresh();
  };

  if (isPending || !session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#faf9f6] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-2xl border bg-white p-8 shadow-sm">
        <div className="text-center">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
            {session.user.name?.charAt(0).toUpperCase() || "U"}
          </div>

          <h1 className="mt-5 text-2xl font-bold text-gray-900">
            My Profile
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your BookNook account information.
          </p>
        </div>

        <div className="mt-8 space-y-5">
          <div>
            <p className="text-sm text-gray-500">Full Name</p>
            <p className="mt-1 font-semibold text-gray-900">
              {session.user.name}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Email Address</p>
            <p className="mt-1 font-semibold text-gray-900">
              {session.user.email}
            </p>
          </div>

          <div>
            <p className="text-sm text-gray-500">Account Status</p>
            <p className="mt-1 font-semibold text-green-600">
              Logged In
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="mt-8 w-full rounded-lg bg-red-600 px-5 py-3 font-semibold text-white transition hover:bg-red-700"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
