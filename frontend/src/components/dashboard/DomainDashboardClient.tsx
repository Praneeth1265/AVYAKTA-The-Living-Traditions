"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import IndicatorBuzzer from "./IndicatorBuzzer";

type RecruitRow = {
  id: string;
  name: string;
  srn: string;
  email: string;
  phone_no: string;
  year: number;
  branch: string;
  section: string;
  links: string | null;
  experience: string | null;
  why_you: string;
  why_us: string;
  first_preference_status: string | null;
  second_preference_status?: string | null;
  first_preference_domain: string;
  second_domain_preference: string | null;
  interview: boolean | null;
};

type CounterRow = {
  domain: string;
  not_sure: number;
  approved: number;
  rejected: number;
};

type IndicatorRow = {
  id: string;
  domain: string;
  indicator: boolean;
};

const normalizeStatus = (status: string | null | undefined) =>
  status === "not_sure" || !status ? "pending" : status;

const isPendingStatus = (status: string | null | undefined) =>
  normalizeStatus(status) === "pending";

function RecruitAction({
  status,
  isRecruitmentOpen,
  href,
}: {
  status: string | null | undefined;
  isRecruitmentOpen: boolean;
  href: string;
}) {
  if (!isPendingStatus(status)) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
        Finalized
      </span>
    );
  }

  if (!isRecruitmentOpen) {
    return (
      <span className="inline-flex rounded-full bg-gray-100 px-3 py-1.5 text-xs font-semibold text-gray-500">
        Pending
      </span>
    );
  }

  return (
    <Link
      href={href}
      className="inline-flex rounded-full bg-amber-600 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-700"
    >
      Open
    </Link>
  );
}

type DomainDashboardClientProps = {
  domain: string;
};

export default function DomainDashboardClient({
  domain,
}: DomainDashboardClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstPreferenceRecruits, setFirstPreferenceRecruits] = useState<
    RecruitRow[]
  >([]);
  const [secondPreferenceRecruits, setSecondPreferenceRecruits] = useState<
    RecruitRow[]
  >([]);
  const [counter, setCounter] = useState<CounterRow | null>(null);
  const [indicator, setIndicator] = useState<IndicatorRow | null>(null);

  useEffect(() => {
    const loadDomainData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/domain/${domain}/recruits`);
        if (!response.ok) {
          throw new Error("Failed to load domain data");
        }

        const payload = await response.json();

        setFirstPreferenceRecruits(payload.firstPreference ?? []);
        setSecondPreferenceRecruits(payload.secondPreference ?? []);
        setCounter(payload.counter ?? null);
        setIndicator(payload.indicator ?? null);
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load domain data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (domain) {
      loadDomainData();
    }
  }, [domain]);

  const handleDownloadPdf = () => {
    const doc = new jsPDF();
    const marginX = 14;
    let y = 16;

    doc.setFontSize(16);
    doc.text(`${domain} - Recruitment Report`, marginX, y);
    y += 6;
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, marginX, y);

    const toRow = (
      recruit: RecruitRow,
      preference: "First" | "Second",
      status: string,
    ) => [
      recruit.name || "N/A",
      recruit.srn || "N/A",
      recruit.email || "N/A",
      recruit.phone_no || "N/A",
      recruit.branch || "N/A",
      recruit.section || "N/A",
      recruit.year != null ? String(recruit.year) : "N/A",
      preference,
      status,
    ];

    const rows = [
      ...firstPreferenceRecruits.map((recruit) =>
        toRow(
          recruit,
          "First",
          normalizeStatus(recruit.first_preference_status),
        ),
      ),
      ...secondPreferenceRecruits.map((recruit) =>
        toRow(
          recruit,
          "Second",
          normalizeStatus(recruit.second_preference_status),
        ),
      ),
    ];

    autoTable(doc, {
      startY: y + 6,
      head: [
        [
          "Name",
          "SRN",
          "Email",
          "Phone",
          "Branch",
          "Section",
          "Year",
          "Preference",
          "Status",
        ],
      ],
      body: rows,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [146, 121, 27] },
    });

    doc.save(`${domain.replace(/\s+/g, "_")}_Recruitment_Report.pdf`);
  };

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/auth/login");
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {domain} Dashboard
              </h1>
              <p className="mt-2 text-gray-600">
                Recruitment summary for this domain.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleDownloadPdf}
                disabled={
                  loading ||
                  (firstPreferenceRecruits.length === 0 &&
                    secondPreferenceRecruits.length === 0)
                }
                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                Download PDF
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </section>

        {loading && (
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-gray-500">
            Loading recruits...
          </section>
        )}

        {error && !loading && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
            {error}
          </section>
        )}

        {!loading && !error && (
          <>
            <section className="grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">Pending</div>
                <div className="mt-1 text-3xl font-bold text-amber-700">
                  {counter?.not_sure ?? 0}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">Approved</div>
                <div className="mt-1 text-3xl font-bold text-green-700">
                  {counter?.approved ?? 0}
                </div>
              </div>
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="text-sm text-gray-500">Rejected</div>
                <div className="mt-1 text-3xl font-bold text-red-700">
                  {counter?.rejected ?? 0}
                </div>
              </div>
            </section>

            {indicator && (
              <section className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      Recruitment Status
                    </h2>
                    <p className="text-sm text-gray-500">
                      Only the admin dashboard can open recruitment. You can
                      close it from here once it&apos;s open.
                    </p>
                  </div>
                  <IndicatorBuzzer
                    domain={domain}
                    initialStatus={indicator.indicator}
                    mode="domain"
                    direction="close"
                    onUpdated={(nextStatus) =>
                      setIndicator((prev) =>
                        prev ? { ...prev, indicator: nextStatus } : prev,
                      )
                    }
                  />
                </div>
              </section>
            )}

            <section className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100">
                <h2 className="text-xl font-semibold text-gray-900">
                  First Preference Recruits
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-gray-500">
                      <tr>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">SRN</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {firstPreferenceRecruits.map((recruit) => (
                        <tr
                          key={recruit.id}
                          className="border-t border-gray-100"
                        >
                          <td className="py-3 pr-4">{recruit.name}</td>
                          <td className="py-3 pr-4 font-mono text-xs">
                            {recruit.srn}
                          </td>
                          <td className="py-3">
                            {normalizeStatus(recruit.first_preference_status)}
                          </td>
                          <td className="py-3">
                            <RecruitAction
                              status={recruit.first_preference_status}
                              isRecruitmentOpen={Boolean(indicator?.indicator)}
                              href={`/domain/${domain}/${recruit.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="rounded-2xl bg-white p-5 shadow-sm border border-gray-100 lg:col-span-2">
                <h2 className="text-xl font-semibold text-gray-900">
                  Second Preference Recruits
                </h2>
                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left text-gray-500">
                      <tr>
                        <th className="py-2 pr-4">Name</th>
                        <th className="py-2 pr-4">SRN</th>
                        <th className="py-2">Status</th>
                        <th className="py-2">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {secondPreferenceRecruits.map((recruit) => (
                        <tr
                          key={recruit.id}
                          className="border-t border-gray-100"
                        >
                          <td className="py-3 pr-4">{recruit.name}</td>
                          <td className="py-3 pr-4 font-mono text-xs">
                            {recruit.srn}
                          </td>
                          <td className="py-3">
                            {normalizeStatus(recruit.second_preference_status)}
                          </td>
                          <td className="py-3">
                            <RecruitAction
                              status={recruit.second_preference_status}
                              isRecruitmentOpen={Boolean(indicator?.indicator)}
                              href={`/domain/${domain}/${recruit.id}`}
                            />
                          </td>
                        </tr>
                      ))}
                      {secondPreferenceRecruits.length === 0 && (
                        <tr>
                          <td
                            className="py-4 text-sm text-gray-500"
                            colSpan={4}
                          >
                            No second-preference applicants yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}
