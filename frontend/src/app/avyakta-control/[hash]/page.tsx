import Link from "next/link";

export default async function AdminControlEntryPage({
  params,
}: {
  params: Promise<{ hash: string }>;
}) {
  const { hash } = await params;

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-2xl rounded-2xl bg-white p-8 shadow-sm border border-gray-100">
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          Avyakta Control
        </p>
        <h1 className="mt-3 text-3xl font-bold text-gray-900">Control Entry</h1>
        <p className="mt-3 text-gray-600">
          Hash: <span className="font-mono text-sm text-gray-900">{hash}</span>
        </p>
        <p className="mt-3 text-gray-600">
          Open the admin control dashboard for recruitment indicators.
        </p>

        <div className="mt-6 flex gap-3">
          <Link
            href={`/avyakta-control/${hash}/dashboard`}
            className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
          >
            Open Dashboard
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            Admin Home
          </Link>
        </div>
      </div>
    </main>
  );
}
