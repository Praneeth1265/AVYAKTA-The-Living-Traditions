"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

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
  const router = useRouter();
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

  const displayDomainName = domain
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  const handleIndicatorToggle = async () => {
    if (!indicator || indicator.indicator) return;

    try {
      const response = await fetch(`/api/indicator/${displayDomainName}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ indicator: true }),
      });

      if (!response.ok) {
        throw new Error("Failed to update indicator");
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
          throw new Error("Failed to fetch recruits");
        }

        const data = await response.json();
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
          err instanceof Error ? err.message : "Failed to load recruits"
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
  }, [domain]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading recruits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.back()}
            className="mb-4 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
          >
            ← Back
          </button>
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            {displayDomainName} Domain Dashboard
          </h1>
          <p className="text-gray-600">
            Manage and review recruitment applications
          </p>
        </div>

        {/* Indicator Buzzer */}
        {indicator && (
          <div className="mb-8 flex justify-center">
            <button
              onClick={handleIndicatorToggle}
              disabled={indicator.indicator}
              className={`w-20 h-20 rounded-full font-bold text-white text-2xl transition-all duration-300 ${
                indicator.indicator
                  ? "bg-green-500 cursor-not-allowed opacity-90"
                  : "bg-red-500 hover:bg-red-600 cursor-pointer shadow-lg"
              }`}
            >
              {indicator.indicator ? "✓" : "●"}
            </button>
          </div>
        )}


        {/* Counter Statistics */}
        {counter && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-blue-600">
                {counter.not_sure}
              </div>
              <div className="text-gray-600 mt-2">Pending Review</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-green-600">
                {counter.approved}
              </div>
              <div className="text-gray-600 mt-2">Approved</div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl font-bold text-red-600">
                {counter.rejected}
              </div>
              <div className="text-gray-600 mt-2">Rejected</div>
            </div>
          </div>
        )}

        {/* First Preference Recruits */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            First Preference Recruits ({firstPreferenceRecruits.length})
          </h2>

          {firstPreferenceRecruits.length === 0 ? (
            <p className="text-gray-500">No recruits in first preference</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      SRN
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Interview
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {firstPreferenceRecruits.map((recruit) => (
                    <tr key={`first-${recruit.id}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {recruit.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {recruit.srn}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            recruit.first_preference_status === "approved"
                              ? "bg-green-100 text-green-800"
                              : recruit.first_preference_status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {recruit.first_preference_status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm">
                        {recruit.interview ? (
                          <span className="text-green-600 font-semibold">
                            ✓ Done
                          </span>
                        ) : (
                          <span className="text-gray-500">Pending</span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/domain/${domain}/${recruit.id}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
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
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Second Preference Recruits ({secondPreferenceRecruits.length})
            </h2>
            <p className="text-gray-600 mb-4 text-sm">
              These candidates were rejected from their first preference domain
            </p>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-100 border-b">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      SRN
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      First Domain
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {secondPreferenceRecruits.map((recruit) => (
                    <tr key={`second-${recruit.second_preference_id || recruit.id}`} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-800">
                        {recruit.name}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {recruit.srn}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {recruit.first_preference_domain}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            recruit.second_preference_status === "approved"
                              ? "bg-green-100 text-green-800"
                              : recruit.second_preference_status === "rejected"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {recruit.second_preference_status || "pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/domain/${domain}/${recruit.id}`}
                          className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition"
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
