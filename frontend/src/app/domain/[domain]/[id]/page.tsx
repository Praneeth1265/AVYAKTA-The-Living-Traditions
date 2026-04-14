"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

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

export default function RecruitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const domain = typeof params.domain === "string" ? params.domain : "";
  const recruitId = typeof params.id === "string" ? params.id : "";

  const [recruit, setRecruit] = useState<Recruit | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isSecondPreference, setIsSecondPreference] = useState(false);

  // Form states
  const [interview, setInterview] = useState(false);
  const [status, setStatus] = useState("not_sure");

  useEffect(() => {
    const fetchRecruit = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/domain/${domain}/${recruitId}`);

        if (!response.ok) {
          throw new Error("Recruit not found");
        }

        const data = await response.json();
        setRecruit(data.recruit);

        // Check if this recruit is from second preference
        console.log("Fetched recruit data:", {
          hasSecondPreference: !!data.secondPreference,
          secondPrefData: data.secondPreference,
        });

        if (data.secondPreference) {
          setIsSecondPreference(true);
          setInterview(data.secondPreference.interview);
          setStatus(data.secondPreference.second_preference_status);
          console.log("Set as SECOND PREFERENCE with status:", data.secondPreference.second_preference_status);
        } else {
          setIsSecondPreference(false);
          setInterview(data.recruit.interview);
          setStatus(data.recruit.first_preference_status);
          console.log("Set as FIRST PREFERENCE with status:", data.recruit.first_preference_status);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load recruit details"
        );
      } finally {
        setLoading(false);
      }
    };

    if (domain && recruitId) {
      fetchRecruit();
    }
  }, [domain, recruitId]);

  const handleUpdate = async () => {
    try {
      setIsUpdating(true);
      setSuccessMessage("");

      const updatePayload = {
        interview,
        status,
        isSecondPreference,
      };

      console.log("Sending update with payload:", updatePayload);

      const response = await fetch(`/api/domain/${domain}/${recruitId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatePayload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Update failed:", errorData);
        throw new Error(
          errorData.error || "Failed to update recruit"
        );
      }

      const data = await response.json();
      console.log("Update response:", data);
      
      setSuccessMessage("Recruit updated successfully!");
      
      // Redirect back to domain page after 1 second
      setTimeout(() => {
        router.push(`/domain/${domain}`);
      }, 1000);
    } catch (err) {
      console.error("Update error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to update recruit"
      );
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading recruit details...</div>
      </div>
    );
  }

  if (error || !recruit) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || "Recruit not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back
          </button>
          <h1 className="text-3xl font-bold text-gray-800">{recruit.name}</h1>
          <p className="text-gray-600 mt-1">{recruit.srn}</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {successMessage}
          </div>
        )}

        {/* Recruit Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Recruit Information
          </h2>

          <div className="grid grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Email
              </label>
              <p className="text-gray-700">{recruit.email}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Phone
              </label>
              <p className="text-gray-700">{recruit.phone_no}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Year
              </label>
              <p className="text-gray-700">{recruit.year}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Branch
              </label>
              <p className="text-gray-700">{recruit.branch}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Section
              </label>
              <p className="text-gray-700">{recruit.section}</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                First Preference Domain
              </label>
              <p className="text-gray-700">{recruit.first_preference_domain}</p>
            </div>
          </div>

          {recruit.second_domain_preference && (
            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Second Preference Domain
              </label>
              <p className="text-gray-700">{recruit.second_domain_preference}</p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Experience
            </label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">
              {recruit.experience || "Not provided"}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Why You?
            </label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">
              {recruit.why_you}
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Why Us?
            </label>
            <p className="text-gray-700 bg-gray-50 p-3 rounded">
              {recruit.why_us}
            </p>
          </div>

          {recruit.links && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Portfolio Links
              </label>
              <div className="bg-gray-50 p-3 rounded">
                {typeof recruit.links === "string" && recruit.links.trim() && (
                  <ul className="list-disc list-inside space-y-1">
                    {(() => {
                      try {
                        const links = JSON.parse(recruit.links);
                        if (Array.isArray(links)) {
                          return links.map((link: string, idx: number) => (
                            <li key={idx}>
                              <a
                                href={link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline break-all"
                              >
                                {link}
                              </a>
                            </li>
                          ));
                        }
                      } catch {
                        return (
                          <li className="text-gray-500">
                            Invalid links format
                          </li>
                        );
                      }
                    })()}
                  </ul>
                )}
                {(!recruit.links || !recruit.links.trim()) && (
                  <p className="text-gray-500">No portfolio links provided</p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Interview & Status Update Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Interview & Status
          </h2>

          {/* Interview Checkbox */}
          <div className="mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={interview}
                onChange={(e) => setInterview(e.target.checked)}
                disabled={status === "rejected"}
                className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
              />
              <span className="ml-3 text-lg font-semibold text-gray-700">
                Interview Completed
              </span>
            </label>
            <p className="text-gray-500 text-sm mt-2">
              Mark this if the interview has been conducted
            </p>
          </div>

          {/* Status Update (only show if interview is marked) */}
          {interview && (
            <div>
              {status === "rejected" && (
                <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                  <p className="text-red-800 text-sm font-semibold">
                    ⚠️ Rejected status is FINAL and cannot be changed
                  </p>
                </div>
              )}
              <div className="mb-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Interview Decision
                </label>
                <div className="space-y-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="approved"
                      checked={status === "approved"}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={status === "rejected"}
                      className="w-4 h-4 text-green-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className={`ml-3 text-gray-700 ${status === "rejected" ? "opacity-50" : ""}`}>
                      ✓ Approved - Move to next round
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="rejected"
                      checked={status === "rejected"}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={status === "rejected"}
                      className="w-4 h-4 text-red-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className={`ml-3 text-gray-700 ${status === "rejected" ? "opacity-50" : ""}`}>
                      ✗ Rejected - Not selected (FINAL)
                    </span>
                  </label>
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="radio"
                      name="status"
                      value="not_sure"
                      checked={status === "not_sure"}
                      onChange={(e) => setStatus(e.target.value)}
                      disabled={status === "rejected"}
                      className="w-4 h-4 text-yellow-600 cursor-pointer disabled:cursor-not-allowed disabled:opacity-50"
                    />
                    <span className={`ml-3 text-gray-700 ${status === "rejected" ? "opacity-50" : ""}`}>
                      ? Hold - Need more consideration
                    </span>
                  </label>
                </div>
              </div>
            </div>
          )}

          {!interview && (
            <div className="p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded mb-6">
              <p className="text-yellow-800 text-sm">
                Complete the interview first to make a decision
              </p>
            </div>
          )}

          {status === "rejected" && (
            <div className="p-4 bg-gray-100 border-l-4 border-gray-400 rounded mb-6">
              <p className="text-gray-700 text-sm">
                This candidate has been permanently rejected - no further changes allowed
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleUpdate}
            disabled={isUpdating || !interview}
            className={`w-full px-6 py-3 font-semibold rounded-lg transition ${
              interview && !isUpdating
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-600 cursor-not-allowed"
            }`}
          >
            {isUpdating ? "Updating..." : "Update Recruit Status"}
          </button>
        </div>
      </div>
    </div>
  );
}
