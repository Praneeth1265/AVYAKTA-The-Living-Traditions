"use client";

import { useEffect, useMemo, useState } from "react";

type RecruitmentReportRow = {
  id: string;
  name: string;
  email: string;
  phone_no: string;
  srn: string;
  branch: string;
  section: string;
  year: number;
  first_preference_domain: string;
  second_domain_preference: string | null;
  experience: string | null;
  why_you: string;
  why_us: string;
  first_preference_status: string | null;
  interview: boolean | null;
  created_at?: string;
};

type ReportPayload = {
  domain: string;
  total_count: number;
  recruits: RecruitmentReportRow[];
  generated_at: string;
  stats?: {
    not_sure: number;
    approved: number;
    rejected: number;
    interview: number;
  };
};

type DomainReportsProps = {
  domain: string;
};

const normalizeStatus = (status: string | null | undefined) =>
  status === "not_sure" || !status ? "pending" : status;

export default function DomainReports({ domain }: DomainReportsProps) {
  const [reportData, setReportData] = useState<ReportPayload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/recruitment/report", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain }),
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error ?? "Failed to fetch report data");
        }

        setReportData(await response.json());
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to fetch report data",
        );
      } finally {
        setLoading(false);
      }
    };

    if (domain) {
      fetchReport();
    }
  }, [domain]);

  const csvContent = useMemo(() => {
    if (!reportData) {
      return "";
    }

    const header = [
      "Name",
      "SRN",
      "Email",
      "Phone",
      "Branch",
      "Section",
      "Status",
      "Interview",
    ];

    const rows = reportData.recruits.map((recruit) => [
      recruit.name,
      recruit.srn,
      recruit.email,
      recruit.phone_no,
      recruit.branch,
      recruit.section,
      normalizeStatus(recruit.first_preference_status),
      recruit.interview ? "Yes" : "No",
    ]);

    return [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","),
      )
      .join("\n");
  }, [reportData]);

  const handleDownloadCsv = () => {
    if (!csvContent) {
      return;
    }

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${domain.replace(/\s+/g, "_")}_Recruitment_Report.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{domain} Report</h2>
          <p className="mt-1 text-gray-600">Recruitment export and summary.</p>
        </div>

        <button
          type="button"
          onClick={handleDownloadCsv}
          disabled={!csvContent || loading}
          className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          Download CSV
        </button>
      </div>

      {loading && (
        <p className="mt-6 text-sm text-gray-500">Loading report...</p>
      )}

      {error && !loading && (
        <p className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </p>
      )}

      {reportData && !loading && !error && (
        <div className="mt-6 space-y-6">
          <div className="grid gap-3 md:grid-cols-4">
            <div className="rounded-xl bg-gray-50 p-4">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-2xl font-bold text-gray-900">
                {reportData.total_count}
              </div>
            </div>
            <div className="rounded-xl bg-amber-50 p-4">
              <div className="text-sm text-amber-700">Pending</div>
              <div className="text-2xl font-bold text-amber-800">
                {reportData.stats?.not_sure ?? 0}
              </div>
            </div>
            <div className="rounded-xl bg-green-50 p-4">
              <div className="text-sm text-green-700">Approved</div>
              <div className="text-2xl font-bold text-green-800">
                {reportData.stats?.approved ?? 0}
              </div>
            </div>
            <div className="rounded-xl bg-red-50 p-4">
              <div className="text-sm text-red-700">Rejected</div>
              <div className="text-2xl font-bold text-red-800">
                {reportData.stats?.rejected ?? 0}
              </div>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="min-w-full text-sm">
              <thead className="bg-gray-50 text-left text-gray-600">
                <tr>
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">SRN</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Interview</th>
                </tr>
              </thead>
              <tbody>
                {reportData.recruits.map((recruit) => (
                  <tr key={recruit.id} className="border-t border-gray-100">
                    <td className="px-4 py-3">{recruit.name}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      {recruit.srn}
                    </td>
                    <td className="px-4 py-3">{recruit.email}</td>
                    <td className="px-4 py-3">
                      {normalizeStatus(recruit.first_preference_status)}
                    </td>
                    <td className="px-4 py-3">
                      {recruit.interview ? "Yes" : "No"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
}
