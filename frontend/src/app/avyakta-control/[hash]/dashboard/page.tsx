"use client";

import { FormEvent, useState } from "react";

type EventFormState = {
  title: string;
  description: string;
  moreDescription: string;
  domain: string;
  highlights: string;
  timeline: string;
  date: string;
  thumbnailUrl: string;
  detailImageUrl: string;
};

const initialState: EventFormState = {
  title: "",
  description: "",
  moreDescription: "",
  domain: "",
  highlights: "",
  timeline: "",
  date: "",
  thumbnailUrl: "",
  detailImageUrl: "",
};

export default function DashboardPage() {
  const [form, setForm] = useState<EventFormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/events", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        setError(payload?.error || "Failed to create event.");
        return;
      }

      setMessage("Event created successfully.");
      setForm(initialState);
    } catch {
      setError("Could not connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-6 py-12 text-[#1C1C1C] md:px-12">
      <section className="mx-auto w-full max-w-4xl rounded-2xl border border-[#C9A84C]/40 bg-white p-6 shadow-[0_10px_30px_rgba(40,22,6,0.12)] md:p-8">
        <p className="text-xs uppercase tracking-[0.18em] text-[#737955]">
          Admin Dashboard
        </p>
        <h1 className="mt-3 text-3xl font-semibold text-[#92791B]">
          Create Event
        </h1>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
            placeholder="Event title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />

          <textarea
            className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
            placeholder="Short description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={3}
            required
          />

          <textarea
            className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
            placeholder="Detailed description"
            value={form.moreDescription}
            onChange={(e) =>
              setForm({ ...form, moreDescription: e.target.value })
            }
            rows={5}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <input
              className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
              placeholder="Domain (e.g. Music and Theatre)"
              value={form.domain}
              onChange={(e) => setForm({ ...form, domain: e.target.value })}
              required
            />

            <input
              className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
              type="date"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>

          <input
            className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
            placeholder="Highlights (semicolon/comma separated)"
            value={form.highlights}
            onChange={(e) => setForm({ ...form, highlights: e.target.value })}
          />

          <input
            className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
            placeholder="Timeline (e.g. 10:00 - Intro|11:00 - Main Show)"
            value={form.timeline}
            onChange={(e) => setForm({ ...form, timeline: e.target.value })}
          />

          <input
            className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
            placeholder="Thumbnail URL"
            value={form.thumbnailUrl}
            onChange={(e) =>
              setForm({ ...form, thumbnailUrl: e.target.value })
            }
          />

          <input
            className="w-full rounded-xl border border-[#C9A84C]/40 px-4 py-3"
            placeholder="Detail image URL (optional)"
            value={form.detailImageUrl}
            onChange={(e) =>
              setForm({ ...form, detailImageUrl: e.target.value })
            }
          />

          <button
            type="submit"
            className="rounded-full bg-[#92791B] px-6 py-3 font-semibold text-white disabled:opacity-60"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Create Event"}
          </button>

          {message ? <p className="text-[#1B5E3B]">{message}</p> : null}
          {error ? <p className="text-[#8B1A1A]">{error}</p> : null}
        </form>
      </section>
    </main>
  );
}
