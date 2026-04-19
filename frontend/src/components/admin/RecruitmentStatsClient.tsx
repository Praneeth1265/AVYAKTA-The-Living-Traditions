"use client";

import React, { useState, useEffect } from "react";
import { RECRUITMENT_DOMAINS } from "../../lib/validators/recruitment";

interface CounterStat {
  domain: string;
  not_sure: number;
  approved: number;
  rejected: number;
}

interface DomainIndicator {
  id: string;
  domain: string;
  indicator: boolean;
}

export default function RecruitmentStatsClient() {
  const [counters, setCounters] = useState<CounterStat[]>([]);
  const [domainIndicators, setDomainIndicators] = useState<DomainIndicator[]>([]);
  const [globalIndicator, setGlobalIndicator] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const [togglingGlobal, setTogglingGlobal] = useState(false);
  const [flushingAll, setFlushingAll] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const [counterRes, indicatorRes] = await Promise.all([
        fetch("/api/recruitment/counter"),
        fetch("/api/recruitment/indicator"),
      ]);

      if (!counterRes.ok || !indicatorRes.ok) throw new Error("Failed to fetch data");

      const counterData = await counterRes.json();
      const indicatorData = await indicatorRes.json();

      setCounters(counterData.data || []);
      
      // Handle indicators - the API returns an array of domain indicators
      const indicatorsArray = Array.isArray(indicatorData.data) ? indicatorData.data : [];
      setDomainIndicators(indicatorsArray);
      
      // Set global indicator (for backward compatibility - use first indicator or false)
      const globalStatus = indicatorsArray.length > 0 ? indicatorsArray[0].indicator : false;
      setGlobalIndicator(globalStatus);
      
      setError("");
    } catch (err) {
      setError("Failed to load recruitment stats");
      console.error("Error fetching data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleGlobalIndicator = async () => {
    try {
      setTogglingGlobal(true);
      const newStatus = !globalIndicator;

      const response = await fetch("/api/recruitment/indicator", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indicator: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update indicator");

      setGlobalIndicator(newStatus);
      setSuccess(`Recruitment ${newStatus ? "enabled" : "disabled"} globally`);
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      setError("Failed to toggle recruitment status");
      console.error("Error toggling indicator:", err);
    } finally {
      setTogglingGlobal(false);
    }
  };

  const handleFlushAllCounters = async () => {
    if (
      !confirm(
        "⚠️ WARNING: This will migrate all approved applicants to the members table, clear ALL recruitment data, reset all domain counters, and CLOSE all recruitment domains. This action CANNOT be undone. Continue?"
      )
    ) {
      return;
    }

    try {
      setFlushingAll(true);
      setError("");
      setSuccess("");

      // Step 1: Flush recruitment data first
      console.log("Step 1: Flushing recruitment data...");
      const recruitmentResponse = await fetch("/api/recruitment/flush", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!recruitmentResponse.ok) {
        const errorData = await recruitmentResponse.json();
        throw new Error(
          errorData.details || errorData.error || "Failed to flush recruitment data"
        );
      }

      const recruitmentResult = await recruitmentResponse.json();

      // Step 2: Flush counters after recruitment data is cleared
      console.log("Step 2: Flushing all counters...");
      const counterResponse = await fetch("/api/recruitment/counter", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ flushAll: true }),
      });

      if (!counterResponse.ok) {
        throw new Error("Failed to flush counters");
      }

      // Step 3: Close all domain indicators
      console.log("Step 3: Closing all domain indicators...");
      for (const domain of RECRUITMENT_DOMAINS) {
        const indicatorResponse = await fetch("/api/recruitment/indicator", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ domain, indicator: false }),
        });

        if (!indicatorResponse.ok) {
          throw new Error(`Failed to close indicator for domain: ${domain}`);
        }
      }

      // All operations successful
      setSuccess(
        `✅ Complete flush successful! Added ${recruitmentResult.stats.totalMembersAdded} new members (${recruitmentResult.stats.secondPreferenceMembers} second preference + ${recruitmentResult.stats.firstPreferenceMembers} first preference). All recruitment data, counters cleared, and recruitment domains closed.`
      );

      // Refresh data to show updated stats
      setTimeout(() => fetchData(), 1000);

      // Clear success message after 6 seconds
      setTimeout(() => setSuccess(""), 6000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`❌ Flush failed: ${errorMessage}`);
      console.error("Error during flush operations:", err);
    } finally {
      setFlushingAll(false);
    }
  };

  const getTotal = (counter: CounterStat) =>
    counter.not_sure + counter.approved + counter.rejected;

  return (
    <main className="recruitment-container">
      <div className="recruitment-wrapper">
        <div className="recruitment-header">
          <div className="recruitment-title-section">
            <p className="recruitment-label">Avyakta Admin</p>
            <h1>Recruitment Management</h1>
            <p>Manage recruitment status and view application stats by domain.</p>
          </div>
        </div>

        <div className="stats-header">
          <div className="header-left">
            <h3>📋 Recruitment Stats</h3>
            <div className="status-display">
              <span className={`indicator-dot ${globalIndicator ? "active" : ""}`}></span>
              <span className="status-text">Recruitment is {globalIndicator ? "OPEN" : "CLOSED"}</span>
            </div>
          </div>
          <div className="header-actions">
            <button onClick={fetchData} className="btn-refresh" disabled={isLoading}>
              {isLoading ? "Loading..." : "Refresh"}
            </button>
            <button
              onClick={handleToggleGlobalIndicator}
              className={`btn-toggle-global ${globalIndicator ? "active" : ""}`}
              disabled={togglingGlobal}
            >
              {togglingGlobal ? "Updating..." : globalIndicator ? "🔓 Close" : "🔒 Open"}
            </button>
            <button onClick={handleFlushAllCounters} className="btn-flush-all" disabled={flushingAll}>
              {flushingAll ? "Processing..." : "🧹 Flush All"}
            </button>
          </div>
        </div>

        {error && <div className="alert alert-error">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <div className="recruitment-grid">
        {RECRUITMENT_DOMAINS.map((domain) => {
          const counter = counters.find((c) => c.domain === domain);
          const domainIndic = domainIndicators.find((d) => d.domain === domain);
          const isActive = domainIndic?.indicator ?? false;
          const total = counter ? getTotal(counter) : 0;

          return (
            <div key={domain} className={`recruitment-card ${isActive ? "active" : "inactive"}`}>
              <div className="card-header">
                <div className="domain-title">
                  <h4>{domain}</h4>
                  <span className={`domain-indicator ${isActive ? "active" : ""}`}>
                    {isActive ? "🟢" : "🔴"}
                  </span>
                </div>
              </div>

              <div className="stats-section">
                <div className="stat-row">
                  <span className="stat-label">Total:</span>
                  <span className="stat-value">{total}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">✅ Approved:</span>
                  <span className="stat-value approved">{counter?.approved || 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">❓ Not Sure:</span>
                  <span className="stat-value waiting">{counter?.not_sure || 0}</span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">❌ Rejected:</span>
                  <span className="stat-value rejected">{counter?.rejected || 0}</span>
                </div>
              </div>
            </div>
          );
        })}
        </div>
      </div>

        <style jsx>{`
        .recruitment-container {
          min-height: 100vh;
          padding: 20px;
          background: linear-gradient(135deg, #f0f4f8 0%, #f5f0e8 50%, #f0f4f8 100%);
          display: flex;
          flex-direction: column;
        }

        .recruitment-wrapper {
          max-width: 1200px;
          margin: 0 auto;
        }

        .recruitment-header {
          margin-bottom: 24px;
        }

        .recruitment-title-section {
          margin: 0 0 24px 0;
        }

        .recruitment-label {
          margin: 0 0 8px 0;
          font-size: 12px;
          font-weight: 600;
          color: #9ca3af;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .recruitment-title-section h1 {
          margin: 0 0 8px 0;
          font-size: 32px;
          font-weight: 700;
          color: #1f2937;
        }

        .recruitment-title-section p {
          margin: 0;
          font-size: 14px;
          color: #6b7280;
        }

        .recruitment-stats-panel {
          padding: 20px;
          background: #fff;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .stats-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 24px;
          padding: 16px;
          background: #f3f4f6;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }

        .header-left {
          display: flex;
          align-items: center;
          gap: 16px;
          flex: 1;
        }

        .header-left h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #1f2937;
          white-space: nowrap;
        }

        .status-display {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          background: white;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .status-text {
          font-size: 13px;
          font-weight: 600;
          color: #1f2937;
        }

        .header-actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .btn-refresh,
        .btn-toggle-global,
        .btn-flush-all {
          padding: 10px 16px;
          border: none;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
        }

        .btn-refresh {
          background-color: #3b82f6;
          color: white;
        }

        .btn-refresh:hover:not(:disabled) {
          background-color: #2563eb;
        }

        .btn-toggle-global {
          background-color: #dbeafe;
          color: #1e40af;
        }

        .btn-toggle-global:hover:not(:disabled) {
          background-color: #bfdbfe;
        }

        .btn-toggle-global.active {
          background-color: #dcfce7;
          color: #166534;
        }

        .btn-toggle-global.active:hover:not(:disabled) {
          background-color: #bbf7d0;
        }

        .btn-flush-all {
          background-color: #fef3c7;
          color: #92400e;
          border: 2px solid #f59e0b;
        }

        .btn-flush-all:hover:not(:disabled) {
          background-color: #fde68a;
          transform: scale(1.05);
        }

        .btn-refresh:disabled,
        .btn-toggle-global:disabled,
        .btn-flush-all:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .alert {
          padding: 12px 16px;
          border-radius: 4px;
          margin-bottom: 16px;
          font-size: 13px;
          font-weight: 500;
        }

        .alert-error {
          background-color: #fee2e2;
          color: #991b1b;
          border: 1px solid #fecaca;
        }

        .alert-success {
          background-color: #dcfce7;
          color: #166534;
          border: 1px solid #bbf7d0;
        }

        .recruitment-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 16px;
        }

        .recruitment-card {
          background: #f9fafb;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          transition: all 0.3s ease;
        }

        .recruitment-card.active {
          background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
          border-color: #86efac;
        }

        .recruitment-card.inactive {
          background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
          border-color: #fca5a5;
        }

        .recruitment-card:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
          transform: translateY(-2px);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 4px;
          gap: 8px;
        }

        .domain-title {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .domain-title h4 {
          margin: 0;
          font-size: 14px;
          font-weight: 600;
          color: #1f2937;
        }

        .domain-indicator {
          font-size: 16px;
          line-height: 1;
          animation: pulse-indicator 2s infinite;
        }

        @keyframes pulse-indicator {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.6;
          }
        }

        .status-badge {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 500;
          padding: 4px 8px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 3px;
          color: #6b7280;
        }

        .indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background-color: #ef4444;
          transition: all 0.2s;
        }

        .indicator-dot.active {
          background-color: #10b981;
        }

        .stats-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .stat-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 0;
          font-size: 13px;
        }

        .stat-label {
          color: #6b7280;
          font-weight: 500;
        }

        .stat-value {
          font-weight: 600;
          color: #1f2937;
        }

        .stat-value.approved {
          color: #10b981;
        }

        .stat-value.waiting {
          color: #f59e0b;
        }

        .stat-value.rejected {
          color: #ef4444;
        }

        @media (max-width: 1024px) {
          .recruitment-grid {
            grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .recruitment-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}
