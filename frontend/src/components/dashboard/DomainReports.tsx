"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface RecruitmentData {
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
  first_preference_status: string;
  interview: boolean;
  created_at?: string;
}

interface ReportData {
  domain: string;
  total_count: number;
  recruits: RecruitmentData[];
  generated_at: string;
}

interface DomainReportsProps {
  domain: string;
}

export default function DomainReports({ domain }: DomainReportsProps) {
  const [reportData, setReportData] = useState<ReportData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data when domain changes
  useEffect(() => {
    console.log("DomainReports mounted for domain:", domain);
    fetchReport();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [domain]);

  const fetchReport = async () => {
    console.log("Fetching report for domain:", domain);
    setIsLoading(true);
    setError(null);
    setReportData(null);

    try {
      const response = await fetch("/api/recruitment/report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain }),
      });

      console.log("API Response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch report data");
      }

      const data: ReportData = await response.json();
      console.log("Received data:", data);
      setReportData(data);
      setError(null);
    } catch (err) {
      const errorMsg =
        err instanceof Error ? err.message : "An unknown error occurred";
      console.error("Fetch error:", errorMsg);
      setError(errorMsg);
      setReportData(null);
    } finally {
      setIsLoading(false);
    }
  };

  const generatePDF = async () => {
    if (!reportData || !reportData.recruits.length) {
      alert("No data available to generate PDF");
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      // Set colors using the Avyakta palette
      const bronzeGold = [146, 121, 27];
      const deepCharcoal = [28, 28, 28];

      // Title
      pdf.setFontSize(20);
      pdf.setTextColor(...bronzeGold);
      pdf.text(
        `${domain} Domain - Recruitment Report`,
        pageWidth / 2,
        margin + 10,
        { align: "center" },
      );

      // Metadata
      pdf.setFontSize(10);
      pdf.setTextColor(...deepCharcoal);
      pdf.text(
        `Generated: ${new Date(reportData.generated_at).toLocaleString()}`,
        margin,
        margin + 25,
      );
      pdf.text(
        `Total Applicants: ${reportData.total_count}`,
        margin,
        margin + 32,
      );

      // Summary Statistics
      const statsByStatus = {
        not_sure: reportData.recruits.filter(
          (r) => r.first_preference_status === "not_sure",
        ).length,
        approved: reportData.recruits.filter(
          (r) => r.first_preference_status === "approved",
        ).length,
        rejected: reportData.recruits.filter(
          (r) => r.first_preference_status === "rejected",
        ).length,
        interview: reportData.recruits.filter((r) => r.interview).length,
      };

      pdf.setFontSize(11);
      pdf.setTextColor(...bronzeGold);
      pdf.text("Summary:", margin, margin + 42);

      pdf.setFontSize(9);
      pdf.setTextColor(...deepCharcoal);
      let yPos = margin + 50;
      pdf.text(`✓ Approved: ${statsByStatus.approved}`, margin + 5, yPos);
      pdf.text(`✗ Rejected: ${statsByStatus.rejected}`, margin + 50, yPos);
      yPos += 6;
      pdf.text(`? Pending: ${statsByStatus.not_sure}`, margin + 5, yPos);
      pdf.text(`📋 Interviews: ${statsByStatus.interview}`, margin + 50, yPos);

      // Main Table
      const tableStartY = margin + 70;

      const tableData = reportData.recruits.map((recruit) => [
        recruit.name,
        recruit.srn,
        recruit.branch,
        recruit.email,
        recruit.phone_no,
        recruit.first_preference_status?.charAt(0).toUpperCase() || "P",
        recruit.interview ? "Yes" : "No",
      ]);

      autoTable(pdf, {
        head: [
          ["Name", "SRN", "Branch", "Email", "Phone", "Status", "Interview"],
        ],
        body: tableData,
        startY: tableStartY,
        margin: {
          top: tableStartY,
          left: margin,
          right: margin,
          bottom: margin,
        },
        headStyles: {
          fillColor: bronzeGold,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
          halign: "center",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: deepCharcoal,
        },
        alternateRowStyles: {
          fillColor: [242, 238, 230],
        },
        columnStyles: {
          0: { halign: "left", cellWidth: 25 },
          1: { halign: "center", cellWidth: 22 },
          2: { halign: "center", cellWidth: 18 },
          3: { halign: "left", cellWidth: 35 },
          4: { halign: "center", cellWidth: 22 },
          5: { halign: "center", cellWidth: 15 },
          6: { halign: "center", cellWidth: 15 },
        },
      });

      // Footer
      const totalPages = (pdf.internal.pages?.length ?? 1) - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }

      // Save PDF
      pdf.save(
        `${domain.replace(/\s+/g, "_")}_Recruitment_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (err) {
      alert(
        `Error generating PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  const generatePDF = async () => {
    if (!reportData || !reportData.recruits.length) {
      alert("No data available to generate PDF");
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;

      const bronzeGold = [146, 121, 27];
      const deepCharcoal = [28, 28, 28];

      pdf.setFontSize(20);
      pdf.setTextColor(...bronzeGold);
      pdf.text(
        `${domain} Domain - Recruitment Report`,
        pageWidth / 2,
        margin + 10,
        { align: "center" },
      );

      pdf.setFontSize(10);
      pdf.setTextColor(...deepCharcoal);
      pdf.text(
        `Generated: ${new Date(reportData.generated_at).toLocaleString()}`,
        margin,
        margin + 25,
      );
      pdf.text(
        `Total Applicants: ${reportData.total_count}`,
        margin,
        margin + 32,
      );

      const statsByStatus = {
        not_sure: reportData.recruits.filter(
          (r) => r.first_preference_status === "not_sure",
        ).length,
        approved: reportData.recruits.filter(
          (r) => r.first_preference_status === "approved",
        ).length,
        rejected: reportData.recruits.filter(
          (r) => r.first_preference_status === "rejected",
        ).length,
        interview: reportData.recruits.filter((r) => r.interview).length,
      };

      pdf.setFontSize(11);
      pdf.setTextColor(...bronzeGold);
      pdf.text("Summary:", margin, margin + 42);

      pdf.setFontSize(9);
      pdf.setTextColor(...deepCharcoal);
      let yPos = margin + 50;
      pdf.text(`✓ Approved: ${statsByStatus.approved}`, margin + 5, yPos);
      pdf.text(`✗ Rejected: ${statsByStatus.rejected}`, margin + 50, yPos);
      yPos += 6;
      pdf.text(`? Pending: ${statsByStatus.not_sure}`, margin + 5, yPos);
      pdf.text(`📋 Interviews: ${statsByStatus.interview}`, margin + 50, yPos);

      const tableStartY = margin + 70;

      const tableData = reportData.recruits.map((recruit) => [
        recruit.name,
        recruit.srn,
        recruit.branch,
        recruit.email,
        recruit.phone_no,
        recruit.first_preference_status?.charAt(0).toUpperCase() || "P",
        recruit.interview ? "Yes" : "No",
      ]);

      autoTable(pdf, {
        head: [
          ["Name", "SRN", "Branch", "Email", "Phone", "Status", "Interview"],
        ],
        body: tableData,
        startY: tableStartY,
        margin: {
          top: tableStartY,
          left: margin,
          right: margin,
          bottom: margin,
        },
        headStyles: {
          fillColor: bronzeGold,
          textColor: [255, 255, 255],
          fontStyle: "bold",
          fontSize: 9,
          halign: "center",
        },
        bodyStyles: {
          fontSize: 8,
          textColor: deepCharcoal,
        },
        alternateRowStyles: {
          fillColor: [242, 238, 230],
        },
        columnStyles: {
          0: { halign: "left", cellWidth: 25 },
          1: { halign: "center", cellWidth: 22 },
          2: { halign: "center", cellWidth: 18 },
          3: { halign: "left", cellWidth: 35 },
          4: { halign: "center", cellWidth: 22 },
          5: { halign: "center", cellWidth: 15 },
          6: { halign: "center", cellWidth: 15 },
        },
      });

      const totalPages = (pdf.internal.pages?.length ?? 1) - 1;
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(150, 150, 150);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, {
          align: "center",
        });
      }

      pdf.save(
        `${domain.replace(/\s+/g, "_")}_Recruitment_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (err) {
      alert(
        `Error generating PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    }
  };

  // SIMPLE RENDER - Buttons always visible
  return (
    <div className="w-full">
      <div className="bg-white rounded-lg shadow-lg p-8 border-2 border-amber-100">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {domain} Domain - Report
        </h2>
        <p className="text-gray-600 mb-6">
          Download recruitment data for {domain}
        </p>

        {/* BUTTONS SECTION - ALWAYS VISIBLE */}
        <div className="bg-gradient-to-r from-amber-50 to-blue-50 border-2 border-amber-300 rounded-lg p-6 mb-6">
          <p className="text-sm font-semibold text-gray-700 mb-4">
            📋 Actions:
          </p>
          <div className="flex flex-wrap gap-4">
            <button
              onClick={fetchReport}
              disabled={isLoading}
              className="px-10 py-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-lg shadow-lg transition transform hover:scale-105"
            >
              {isLoading ? "⏳ Loading Data..." : "🔄 Load/Refresh Data"}
            </button>

            <button
              onClick={generatePDF}
              disabled={!reportData || isLoading}
              className="px-10 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-bold text-lg rounded-lg shadow-lg transition transform hover:scale-105"
            >
              📥 DOWNLOAD PDF REPORT
            </button>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="bg-red-100 border-2 border-red-400 text-red-800 px-6 py-4 rounded-lg mb-6">
            <p className="font-bold">⚠️ Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* LOADING STATE */}
        {isLoading && !reportData && (
          <div className="bg-blue-100 border-2 border-blue-400 text-blue-800 px-6 py-4 rounded-lg mb-6">
            <p className="font-bold">⏳ Loading recruitment data...</p>
            <p className="text-sm">This may take a moment...</p>
          </div>
        )}

        {/* DATA DISPLAY */}
        {reportData && !isLoading && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                📊 Statistics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-300">
                  <div className="text-3xl font-bold text-blue-900">
                    {reportData.total_count}
                  </div>
                  <div className="text-sm text-blue-700 font-semibold">
                    Total Applicants
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border-2 border-green-300">
                  <div className="text-3xl font-bold text-green-900">
                    {
                      reportData.recruits.filter(
                        (r) => r.first_preference_status === "approved",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-green-700 font-semibold">
                    Approved
                  </div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-300">
                  <div className="text-3xl font-bold text-red-900">
                    {
                      reportData.recruits.filter(
                        (r) => r.first_preference_status === "rejected",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-red-700 font-semibold">
                    Rejected
                  </div>
                </div>

                <div className="bg-yellow-50 p-4 rounded-lg border-2 border-yellow-300">
                  <div className="text-3xl font-bold text-yellow-900">
                    {
                      reportData.recruits.filter(
                        (r) => r.first_preference_status === "not_sure",
                      ).length
                    }
                  </div>
                  <div className="text-sm text-yellow-700 font-semibold">
                    Pending
                  </div>
                </div>
              </div>
            </div>

            {/* Applicants Table */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                👥 Applicants
              </h3>
              <div className="overflow-x-auto border border-gray-300 rounded-lg">
                <table className="w-full text-sm">
                  <thead className="bg-amber-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">
                        Name
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">SRN</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Email
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Phone
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Status
                      </th>
                      <th className="px-4 py-3 text-center font-semibold">
                        Interview
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {reportData.recruits.map((recruit, idx) => (
                      <tr
                        key={recruit.id}
                        className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                      >
                        <td className="px-4 py-3 border-b">{recruit.name}</td>
                        <td className="px-4 py-3 border-b font-mono text-xs">
                          {recruit.srn}
                        </td>
                        <td className="px-4 py-3 border-b text-xs">
                          {recruit.email}
                        </td>
                        <td className="px-4 py-3 border-b">
                          {recruit.phone_no}
                        </td>
                        <td className="px-4 py-3 border-b text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-bold ${
                              recruit.first_preference_status === "approved"
                                ? "bg-green-200 text-green-900"
                                : recruit.first_preference_status === "rejected"
                                  ? "bg-red-200 text-red-900"
                                  : "bg-yellow-200 text-yellow-900"
                            }`}
                          >
                            {recruit.first_preference_status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-b text-center font-semibold">
                          {recruit.interview ? "✅ Yes" : "❌ No"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* NO DATA MESSAGE */}
        {!isLoading && !reportData && !error && (
          <div className="bg-gray-100 border-2 border-gray-400 text-gray-800 px-6 py-4 rounded-lg">
            <p className="font-bold">📝 No data loaded yet</p>
            <p className="text-sm">
              Click &quot;Load/Refresh Data&quot; above to fetch recruitment
              records for {domain}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
