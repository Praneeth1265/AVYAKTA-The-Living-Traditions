"use client";

import { useRouter } from "next/navigation";

export default function AdminDashboardClient() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-amber-50 to-teal-50 p-6">
      <div className="mx-auto max-w-6xl rounded-3xl bg-white/90 p-8 shadow-2xl ring-1 ring-black/5">
        <div className="flex flex-col gap-4 border-b border-gray-200 pb-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600">
              Avyakta Admin
            </p>
            <h1 className="mt-2 text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="mt-1 text-sm text-gray-600">
              Manage events, members, registrations, and content from here.
            </p>
          </div>

          <button
            type="button"
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              router.push("/auth/login");
            }}
            className="inline-flex items-center justify-center rounded-full bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-rose-700"
          >
            Logout
          </button>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "Events",
              description: "Create and manage upcoming events and schedules.",
              accent: "border-amber-500",
            },
            {
              title: "Members",
              description: "Track members and their roles inside the club.",
              accent: "border-teal-500",
            },
            {
              title: "Registrations",
              description: "Review registrations and control submissions.",
              accent: "border-orange-500",
            },
          ].map((card) => (
            <section
              key={card.title}
              className={`rounded-2xl border-t-4 ${card.accent} bg-slate-50 p-6 shadow-sm`}
            >
              <h2 className="text-xl font-bold text-gray-900">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{card.description}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
