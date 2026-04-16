"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { isValidDomain } from "@/lib/utils/domainValidator";
import "../../recruit-details.css";

interface Recruit {
  id: string;
  name: string;
  srn: string;
  email: string;
  phone_no: string;
  year: number;
  branch: string;
  section: string;
  first_preference_domain: string;
  second_domain_preference: string | null;
  experience: string | null;
  why_you: string;
  why_us: string;
  links: string | null;
  interview: boolean;
  first_preference_status: string;
}

export default function RecruitDetailsPage(): JSX.Element {
  const params = useParams();
  const router = useRouter();
  const domain = typeof params.domain === "string" ? params.domain : "";
  const recruitId = typeof params.id === "string" ? params.id : "";

  // Hooks must be called unconditionally before any early returns
  const [recruit, setRecruit] = useState<Recruit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [updating, setUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [interviewCompleted, setInterviewCompleted] = useState(false);
  const [status, setStatus] = useState("not_sure");
  const [isSecondPreference, setIsSecondPreference] = useState(false);

  useEffect(() => {
    const fetchRecruitDetails = async (): Promise<void> => {
      try {
        setLoading(true);
        const response = await fetch(`/api/domain/${domain}/${recruitId}`);

        if (!response.ok) {
          throw new Error("Failed to fetch recruit details");
        }

        const data = await response.json();
        setRecruit(data.recruit);

        // Check if this is a second preference recruit
        if (data.secondPreference) {
          setIsSecondPreference(true);
          setInterviewCompleted(data.secondPreference.interview);
          setStatus(data.secondPreference.second_preference_status);
        } else {
          setIsSecondPreference(false);
          setInterviewCompleted(data.recruit.interview);
          setStatus(data.recruit.first_preference_status);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load recruit");
      } finally {
        setLoading(false);
      }
    };

    if (domain && recruitId) {
      fetchRecruitDetails();
    }
  }, [domain, recruitId]);

  const handleUpdateStatus = async (): Promise<void> => {
    if (!recruit) return;

    try {
      setUpdating(true);
      setSuccessMessage("");

      const response = await fetch(`/api/domain/${domain}/${recruitId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          interview: interviewCompleted,
          status,
          isSecondPreference,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update recruit status");
      }

      setSuccessMessage("Recruit status updated successfully!");
      setTimeout(() => {
        router.push(`/domain/${domain}`);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setUpdating(false);
    }
  };

  if (!isValidDomain(domain)) {
    return (
      <div className="recruit-container recruit-error-container">
        <div className="error-box">
          <h1 className="error-title">404 - Invalid Domain</h1>
          <p className="error-message">The domain does not exist.</p>
          <Link href="/domain" className="error-button">
            Back to Domains
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="recruit-container loading-container">
        <div>
          <div className="loading-spinner"></div>
          <div className="loading-text">Loading recruit details...</div>
        </div>
      </div>
    );
  }

  if (error || !recruit) {
    return (
      <div className="recruit-container recruit-error-container">
        <div className="error-box">
          <h1 className="error-title">404 - Recruit Not Found</h1>
          <p className="error-message">
            {error || "The recruit details could not be loaded."}
          </p>
          <Link href={`/domain/${domain}`} className="error-button">
            Back to Domain
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="recruit-container">
      <div className="recruit-inner">
        {/* Header */}
        <div className="recruit-header">
          <Link href={`/domain/${domain}`} className="recruit-back-button">
            ← Back to Domain
          </Link>
          <h1 className="recruit-title">{recruit.name}</h1>
          <p className="recruit-srn">{recruit.srn}</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="success-message">✓ {successMessage}</div>
        )}

        {/* Two Column Layout */}
        <div className="recruit-layout">
          {/* Left Column - Recruit Information */}
          <div className="recruit-left">
            {/* Basic Information */}
            <section className="recruit-section">
              <h2 className="section-title">Recruitment Information</h2>

              <div className="info-grid">
                <div className="info-item">
                  <label className="info-label">Email</label>
                  <p className="info-value">{recruit.email}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Phone</label>
                  <p className="info-value">{recruit.phone_no}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Year</label>
                  <p className="info-value">{recruit.year}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Branch</label>
                  <p className="info-value">{recruit.branch}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">Section</label>
                  <p className="info-value">{recruit.section}</p>
                </div>
                <div className="info-item">
                  <label className="info-label">First Preference Domain</label>
                  <p className="info-value">
                    {recruit.first_preference_domain}
                  </p>
                </div>
              </div>

              {recruit.second_domain_preference && (
                <div className="info-box">
                  <label className="info-label">Second Preference Domain</label>
                  <p className="info-value">
                    {recruit.second_domain_preference}
                  </p>
                </div>
              )}
            </section>

            {/* Additional Information */}
            <section className="recruit-section">
              <h2 className="section-title">Additional Information</h2>

              <div className="text-block">
                <label className="info-label">Experience</label>
                <p className="info-value">
                  {recruit.experience || "Not provided"}
                </p>
              </div>

              <div className="text-block">
                <label className="info-label">Why You?</label>
                <p className="info-value">{recruit.why_you}</p>
              </div>

              <div className="text-block">
                <label className="info-label">Why Us?</label>
                <p className="info-value">{recruit.why_us}</p>
              </div>

              {recruit.links && (
                <div className="text-block">
                  <label className="info-label">Portfolio Links</label>
                  <p className="info-value info-link">
                    <a
                      href={recruit.links}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {recruit.links}
                    </a>
                  </p>
                </div>
              )}
            </section>
          </div>

          {/* Right Column - Interview & Status */}
          <div className="recruit-right">
            <section className="recruit-section status-section">
              <h2 className="section-title">Interview & Status</h2>

              {/* Interview Checkbox */}
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={interviewCompleted}
                    onChange={(e) => setInterviewCompleted(e.target.checked)}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Interview Completed</span>
                </label>
                <p className="checkbox-hint">
                  Mark this if the interview has been conducted
                </p>
              </div>

              {/* Status Radio Buttons */}
              <div className="radio-group">
                <p className="radio-group-label">Interview Decision</p>

                <div className="radio-item">
                  <input
                    type="radio"
                    id="approved"
                    value="approved"
                    checked={status === "approved"}
                    onChange={(e) => setStatus(e.target.value)}
                    className="radio-input"
                  />
                  <label
                    htmlFor="approved"
                    className="radio-label-text approved"
                  >
                    ✓ Approved - Move to next round
                  </label>
                </div>

                <div className="radio-item">
                  <input
                    type="radio"
                    id="rejected"
                    value="rejected"
                    checked={status === "rejected"}
                    onChange={(e) => setStatus(e.target.value)}
                    className="radio-input"
                  />
                  <label
                    htmlFor="rejected"
                    className="radio-label-text rejected"
                  >
                    ✕ Rejected - Not selected (FINAL)
                  </label>
                </div>

                <div className="radio-item">
                  <input
                    type="radio"
                    id="not_sure"
                    value="not_sure"
                    checked={status === "not_sure"}
                    onChange={(e) => setStatus(e.target.value)}
                    className="radio-input"
                  />
                  <label
                    htmlFor="not_sure"
                    className="radio-label-text not-sure"
                  >
                    ⊙ On Hold - Need more consideration
                  </label>
                </div>
              </div>

              {/* Current Status Badge */}
              <div className="current-status">
                <p className="status-label">
                  Current Status (First Preference):
                </p>
                <span
                  className={`status-badge ${recruit.first_preference_status}`}
                >
                  {recruit.first_preference_status}
                </span>
              </div>

              {/* Warning Messages */}
              {status === "rejected" && (
                <div className="warning-box rejected-warning">
                  <p>⚠️ Rejected status is FINAL and cannot be changed</p>
                </div>
              )}

              {!interviewCompleted && (
                <div className="warning-box pending-warning">
                  <p>Complete the interview first to make a decision</p>
                </div>
              )}

              {/* Update Button */}
              <button
                onClick={handleUpdateStatus}
                disabled={updating || !interviewCompleted}
                className={`update-button ${updating ? "button-loading" : ""}`}
              >
                {updating ? "Updating..." : "Update Recruit Status"}
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
