"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { formatDomainFromUrl } from "@/lib/utils/domainFormatter";
import { isValidDomain } from "@/lib/utils/domainValidator";
import "../domain-dashboard.css";

interface Recruit {
  id: string;
  name: string;
  srn: string;
  first_preference_domain: string;
  first_preference_status: string;
  second_domain_preference: string | null;
  interview: boolean;
  second_preference_id?: string;
  second_preference_interview?: boolean;
  second_preference_status?: string;
}

interface Counter {
  domain: string;
  not_sure: number;
  approved: number;
  rejected: number;
}

interface Indicator {
  id: string;
  domain: string;
  indicator: boolean;
}

export default function DomainDashboard() {
  const params = useParams();
  const domain = typeof params.domain === "string" ? params.domain : "";

  const [firstPreferenceRecruits, setFirstPreferenceRecruits] = useState<
    Recruit[]
  >([]);
  const [secondPreferenceRecruits, setSecondPreferenceRecruits] = useState<
    Recruit[]
  >([]);
  const [counter, setCounter] = useState<Counter | null>(null);
  const [indicator, setIndicator] = useState<Indicator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isPdfGenerating, setIsPdfGenerating] = useState(false);

  const displayDomainName = formatDomainFromUrl(domain);

  const generatePDF = async () => {
    if (!firstPreferenceRecruits.length && !secondPreferenceRecruits.length) {
      alert("No recruitment data available to download");
      return;
    }

    setIsPdfGenerating(true);
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
        `${displayDomainName} Domain - Recruitment Report`,
        pageWidth / 2,
        margin + 10,
        { align: "center" },
      );

      pdf.setFontSize(10);
      pdf.setTextColor(...deepCharcoal);
      pdf.text(
        `Generated: ${new Date().toLocaleString()}`,
        margin,
        margin + 25,
      );
      pdf.text(
        `Recruits: ${firstPreferenceRecruits.length + secondPreferenceRecruits.length}`,
        margin,
        margin + 32,
      );

      if (counter) {
        pdf.setFontSize(11);
        pdf.setTextColor(...bronzeGold);
        pdf.text("Summary:", margin, margin + 42);

        pdf.setFontSize(9);
        pdf.setTextColor(...deepCharcoal);
        let yPos = margin + 50;
        pdf.text(`✓ Approved: ${counter.approved}`, margin + 5, yPos);
        pdf.text(`✗ Rejected: ${counter.rejected}`, margin + 50, yPos);
        yPos += 6;
        pdf.text(`? Pending: ${counter.not_sure}`, margin + 5, yPos);
      }

      let currentY = margin + 70;

      // First Preference Table
      if (firstPreferenceRecruits.length > 0) {
        pdf.setFontSize(12);
        pdf.setTextColor(...bronzeGold);
        pdf.text("First Preference Recruits", margin, currentY);
        currentY += 8;

        const firstPrefData = firstPreferenceRecruits.map((recruit) => [
          recruit.name,
          recruit.srn,
          recruit.first_preference_status || "pending",
          recruit.interview ? "Yes" : "No",
        ]);

        autoTable(pdf, {
          head: [["Name", "SRN", "Status", "Interview"]],
          body: firstPrefData,
          startY: currentY,
          headStyles: {
            fillColor: bronzeGold,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
          bodyStyles: {
            fontSize: 8,
            textColor: deepCharcoal,
          },
          alternateRowStyles: {
            fillColor: [242, 238, 230],
          },
          margin: { left: margin, right: margin, bottom: margin },
        });

        currentY =
          (pdf as jsPDF & { lastAutoTable?: { finalY: number } }).lastAutoTable
            ?.finalY || currentY + 10;
      }

      // Second Preference Table
      if (secondPreferenceRecruits.length > 0) {
        pdf.addPage();
        let pageY = margin;

        pdf.setFontSize(12);
        pdf.setTextColor(...bronzeGold);
        pdf.text("Second Preference Recruits", margin, pageY);
        pageY += 8;

        const secondPrefData = secondPreferenceRecruits.map((recruit) => [
          recruit.name,
          recruit.srn,
          recruit.first_preference_domain,
          recruit.second_preference_status || "pending",
        ]);

        autoTable(pdf, {
          head: [["Name", "SRN", "First Domain", "Status"]],
          body: secondPrefData,
          startY: pageY,
          headStyles: {
            fillColor: bronzeGold,
            textColor: [255, 255, 255],
            fontStyle: "bold",
            fontSize: 9,
          },
          bodyStyles: {
            fontSize: 8,
            textColor: deepCharcoal,
          },
          alternateRowStyles: {
            fillColor: [242, 238, 230],
          },
          margin: { left: margin, right: margin, bottom: margin },
        });
      }

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

      pdf.save(
        `${displayDomainName.replace(/\s+/g, "_")}_Recruitment_Report_${new Date().toISOString().split("T")[0]}.pdf`,
      );
    } catch (err) {
      alert(
        `Error generating PDF: ${err instanceof Error ? err.message : "Unknown error"}`,
      );
    } finally {
      setIsPdfGenerating(false);
    }
  };

  const handleIndicatorToggle = async () => {
    if (!indicator || indicator.indicator) return;

    try {
      const response = await fetch(`/api/indicator/${domain}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indicator: true }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error Response:", {
          status: response.status,
          error: errorData,
          domain: domain,
          displayDomain: displayDomainName,
        });
        throw new Error(
          `Failed to update indicator: ${errorData.error || response.statusText}`,
        );
      }

      const updatedIndicator = await response.json();
      setIndicator(updatedIndicator);
    } catch (err) {
      console.error("Error updating indicator:", err);
    }
  };

  useEffect(() => {
    const fetchRecruits = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/domain/${domain}/recruits`);

        if (!response.ok) {
          throw new Error(`Failed to fetch recruits: ${response.status}`);
        }

        const data = await response.json();
        console.log("Fetched recruit data:", {
          domain,
          displayDomainName,
          indicator: data.indicator,
          firstPrefLength: data.firstPreference?.length,
          secondPrefLength: data.secondPreference?.length,
        });

        setFirstPreferenceRecruits(data.firstPreference || []);
        setSecondPreferenceRecruits(data.secondPreference || []);
        setCounter(data.counter);

        // Set indicator from response or default
        if (data.indicator) {
          setIndicator(data.indicator);
        } else {
          setIndicator({
            id: "",
            domain: displayDomainName,
            indicator: false,
          });
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load recruits",
        );
        // Set default indicator on error
        setIndicator({
          id: "",
          domain: displayDomainName,
          indicator: false,
        });
      } finally {
        setLoading(false);
      }
    };

    if (domain) {
      fetchRecruits();
    }
  }, [domain, displayDomainName]);

  if (!isValidDomain(domain)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            404 - Domain Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The domain {displayDomainName} does not exist or is not available.
          </p>
          <Link
            href="/domain"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Domains
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="domain-dashboard-container loading-container">
        <div>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading recruits...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="domain-dashboard-container domain-error-container">
        <div className="error-box">
          <h1 className="error-title">Error</h1>
          <p className="error-message">{error}</p>
          <Link href="/domain" className="error-button">
            Back to Domains
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="domain-dashboard-container">
      <div className="domain-dashboard-inner">
        {/* Header */}
        <div className="domain-header">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: "30px",
            }}
          >
            <div>
              <h1 className="domain-title">
                {displayDomainName} Domain Dashboard
              </h1>
              <p className="domain-subtitle">
                Manage and review recruitment applications
              </p>
            </div>

            {/* Download Button Container */}
            <div className="download-button-container">
              <div className="download-button-label"> Download Report</div>
              <div className="download-button-content">
                <button
                  onClick={generatePDF}
                  disabled={isPdfGenerating}
                  className="download-pdf-button"
                >
                  {isPdfGenerating ? "⏳ Generating..." : "Download PDF"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Rangoli Divider */}
        <div className="rangoli-divider"></div>

        {/* Indicator Buzzer */}
        {indicator && (
          <div className="indicator-container">
            <button
              onClick={handleIndicatorToggle}
              disabled={indicator.indicator}
              className={`indicator-button ${
                indicator.indicator
                  ? "indicator-button-green"
                  : "indicator-button-red"
              }`}
            >
              {indicator.indicator ? "✓" : "●"}
            </button>
          </div>
        )}

        {/* Counter Statistics */}
        {counter && (
          <div className="counter-grid">
            <div className="counter-card pending">
              <div className="counter-number">{counter.not_sure}</div>
              <div className="counter-label">Pending Review</div>
            </div>
            <div className="counter-card approved">
              <div className="counter-number">{counter.approved}</div>
              <div className="counter-label">Approved</div>
            </div>
            <div className="counter-card rejected">
              <div className="counter-number">{counter.rejected}</div>
              <div className="counter-label">Rejected</div>
            </div>
          </div>
        )}

        {/* First Preference Recruits */}
        <div className="domain-section">
          <h2 className="domain-section-title">
            First Preference Recruits ({firstPreferenceRecruits.length})
          </h2>

          {firstPreferenceRecruits.length === 0 ? (
            <p className="no-recruits-message">
              No recruits in first preference
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="recruits-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SRN</th>
                    <th>Status</th>
                    <th>Interview</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {firstPreferenceRecruits.map((recruit) => (
                    <tr key={`first-${recruit.id}`}>
                      <td>{recruit.name}</td>
                      <td>{recruit.srn}</td>
                      <td>
                        <span
                          className={`status-badge ${recruit.first_preference_status}`}
                        >
                          {recruit.first_preference_status}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`interview-status ${recruit.interview ? "interview-done" : "interview-pending"}`}
                        >
                          {recruit.interview ? "Done" : "Pending"}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/domain/${domain}/${recruit.id}`}
                          className="action-button"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Second Preference Recruits */}
        {secondPreferenceRecruits.length > 0 && (
          <div className="domain-section">
            <h2 className="domain-section-title">
              Second Preference Recruits ({secondPreferenceRecruits.length})
            </h2>
            <p className="domain-section-subtitle">
              These candidates were rejected from their first preference domain
            </p>

            <div className="overflow-x-auto">
              <table className="recruits-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>SRN</th>
                    <th>First Domain</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {secondPreferenceRecruits.map((recruit) => (
                    <tr
                      key={`second-${recruit.second_preference_id || recruit.id}`}
                    >
                      <td>{recruit.name}</td>
                      <td>{recruit.srn}</td>
                      <td>{recruit.first_preference_domain}</td>
                      <td>
                        <span
                          className={`status-badge ${recruit.second_preference_status || "pending"}`}
                        >
                          {recruit.second_preference_status || "pending"}
                        </span>
                      </td>
                      <td>
                        <Link
                          href={`/domain/${domain}/${recruit.id}`}
                          className="action-button"
                        >
                          View Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
