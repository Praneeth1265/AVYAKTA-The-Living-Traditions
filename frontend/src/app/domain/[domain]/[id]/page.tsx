"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { formatDomainFromUrl } from "@/lib/utils/domainFormatter";
import { isValidDomain } from "@/lib/utils/domainValidator";
import "../../recruit-details.css";

type RecruitRow = {
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
  interview: boolean | null;
  first_preference_status: string | null;
};

type SecondPreferenceRow = {
  id: string;
  recruitment_id: string;
  interview: boolean | null;
  second_preference_status: string | null;
};

const normalizeStatus = (status: string | null | undefined) =>
  status === "not_sure" || !status ? "pending" : status;

const parseLinks = (links: string | null): string[] => {
  if (!links) {
    return [];
  }

  try {
    const parsed = JSON.parse(links);
    return Array.isArray(parsed)
      ? parsed.filter((link) => typeof link === "string")
      : [];
  } catch {
    return [];
  }
};

export default function RecruitDetailPage() {
  const params = useParams();
  const router = useRouter();
  const domain = typeof params.domain === "string" ? params.domain : "";
  const recruitId = typeof params.id === "string" ? params.id : "";

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recruit, setRecruit] = useState<RecruitRow | null>(null);
  const [secondPreference, setSecondPreference] =
    useState<SecondPreferenceRow | null>(null);
  const [firstStatus, setFirstStatus] = useState("pending");
  const [firstPersistedStatus, setFirstPersistedStatus] = useState("pending");
  const [firstInterview, setFirstInterview] = useState(false);
  const [secondStatus, setSecondStatus] = useState("pending");
  const [secondPersistedStatus, setSecondPersistedStatus] = useState("pending");
  const [secondInterview, setSecondInterview] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadRecruit = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!isValidDomain(domain) || !recruitId) {
          throw new Error("Invalid recruit route");
        }

        const response = await fetch(`/api/domain/${domain}/${recruitId}`);
        if (!response.ok) {
          throw new Error("Failed to load recruit details");
        }

        const payload = await response.json();
        setRecruit(payload.recruit ?? null);
        setSecondPreference(payload.secondPreference ?? null);

        const recruitStatus = normalizeStatus(
          payload.recruit?.first_preference_status,
        );
        setFirstStatus(recruitStatus);
        setFirstPersistedStatus(recruitStatus);
        setFirstInterview(Boolean(payload.recruit?.interview));

        const secondPreferenceStatus = normalizeStatus(
          payload.secondPreference?.second_preference_status,
        );
        setSecondStatus(secondPreferenceStatus);
        setSecondPersistedStatus(secondPreferenceStatus);
        setSecondInterview(Boolean(payload.secondPreference?.interview));
      } catch (loadError) {
        setError(
          loadError instanceof Error
            ? loadError.message
            : "Failed to load recruit details",
        );
      } finally {
        setLoading(false);
      }
    };

    loadRecruit();
  }, [domain, recruitId]);

  const selectStatus = (
    nextStatus: "approved" | "rejected",
    isSecondPreferenceTarget: boolean,
  ) => {
    if (
      !isSecondPreferenceTarget &&
      (firstPersistedStatus === "approved" ||
        firstPersistedStatus === "rejected")
    ) {
      return;
    }

    if (
      isSecondPreferenceTarget &&
      (secondPersistedStatus === "approved" ||
        secondPersistedStatus === "rejected")
    ) {
      return;
    }

    if (isSecondPreferenceTarget) {
      setSecondStatus((prev) => (prev === nextStatus ? "pending" : nextStatus));
    } else {
      setFirstStatus((prev) => (prev === nextStatus ? "pending" : nextStatus));
    }
  };

  const handleSave = async () => {
    if (!recruitId || !isValidDomain(domain)) {
      return;
    }

    const canEditFirstPreference =
      firstPersistedStatus !== "approved" &&
      firstPersistedStatus !== "rejected";
    const canEditSecondPreference =
      firstStatus === "rejected" &&
      secondPersistedStatus !== "approved" &&
      secondPersistedStatus !== "rejected";

    try {
      setSaving(true);

      const responses: Response[] = [];

      if (canEditFirstPreference) {
        const response = await fetch(`/api/domain/${domain}/${recruitId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interview: firstInterview,
            status: firstStatus,
            isSecondPreference: false,
          }),
        });

        responses.push(response);
      }

      if (
        canEditSecondPreference &&
        (secondPreference ||
          recruit?.second_domain_preference === formatDomainFromUrl(domain))
      ) {
        const response = await fetch(`/api/domain/${domain}/${recruitId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            interview: secondInterview,
            status: secondStatus,
            isSecondPreference: true,
          }),
        });

        responses.push(response);
      }

      if (responses.some((response) => !response.ok)) {
        throw new Error("Failed to update recruit");
      }

      router.push(`/domain/${domain}`);
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Failed to update recruit",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!isValidDomain(domain)) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          Invalid domain.
        </div>
      </main>
    );
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          Loading recruit details...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
          {error}
        </div>
      </main>
    );
  }

  if (!recruit) {
    return (
      <main className="min-h-screen bg-gray-50 p-6">
        <div className="mx-auto max-w-3xl rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          Recruit not found.
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">{recruit.name}</h1>
          <p className="mt-2 text-gray-600">
            {formatDomainFromUrl(domain)} recruit details.
          </p>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <article className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-3">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <div className="text-sm text-gray-600">SRN: {recruit.srn}</div>
            <div className="text-sm text-gray-600">Email: {recruit.email}</div>
            <div className="text-sm text-gray-600">
              Phone: {recruit.phone_no}
            </div>
            <div className="text-sm text-gray-600">
              Branch: {recruit.branch}
            </div>
            <div className="text-sm text-gray-600">
              Section: {recruit.section}
            </div>
            <div className="text-sm text-gray-600">Year: {recruit.year}</div>
          </article>

          <article className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              First Preference
            </h2>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <input
                type="checkbox"
                checked={firstInterview}
                onChange={(event) => setFirstInterview(event.target.checked)}
                disabled={
                  firstPersistedStatus === "approved" ||
                  firstPersistedStatus === "rejected"
                }
              />
              Interview completed
            </label>

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="button"
                onClick={() => selectStatus("approved", false)}
                disabled={
                  saving ||
                  firstPersistedStatus === "approved" ||
                  firstPersistedStatus === "rejected"
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 ${firstStatus === "approved" ? "bg-green-800" : "bg-green-600 hover:bg-green-700"}`}
              >
                Accept
              </button>
              <button
                type="button"
                onClick={() => selectStatus("rejected", false)}
                disabled={
                  saving ||
                  firstPersistedStatus === "approved" ||
                  firstPersistedStatus === "rejected"
                }
                className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 ${firstStatus === "rejected" ? "bg-red-800" : "bg-red-600 hover:bg-red-700"}`}
              >
                Reject
              </button>
            </div>

            {firstStatus === "rejected" &&
              (secondPreference ||
                recruit?.second_domain_preference ===
                  formatDomainFromUrl(domain)) && (
                <>
                  <h3 className="pt-2 text-lg font-semibold text-gray-900">
                    Second Preference
                  </h3>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={secondInterview}
                      onChange={(event) =>
                        setSecondInterview(event.target.checked)
                      }
                      disabled={
                        secondPersistedStatus === "approved" ||
                        secondPersistedStatus === "rejected"
                      }
                    />
                    Interview completed
                  </label>

                  <div className="flex flex-wrap gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => selectStatus("approved", true)}
                      disabled={
                        saving ||
                        secondPersistedStatus === "approved" ||
                        secondPersistedStatus === "rejected"
                      }
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 ${secondStatus === "approved" ? "bg-green-800" : "bg-green-600 hover:bg-green-700"}`}
                    >
                      Accept
                    </button>
                    <button
                      type="button"
                      onClick={() => selectStatus("rejected", true)}
                      disabled={
                        saving ||
                        secondPersistedStatus === "approved" ||
                        secondPersistedStatus === "rejected"
                      }
                      className={`rounded-full px-4 py-2 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:bg-gray-300 ${secondStatus === "rejected" ? "bg-red-800" : "bg-red-600 hover:bg-red-700"}`}
                    >
                      Reject
                    </button>
                  </div>
                </>
              )}

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-gray-300"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </article>
        </section>

        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Application</h2>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Why do you want to join?
            </h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {recruit.why_you}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">
              Why Avyakta?
            </h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {recruit.why_us}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Experience</h3>
            <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-gray-700">
              {recruit.experience || "Not provided"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-900">Links</h3>
            {parseLinks(recruit.links).length > 0 ? (
              <ul className="mt-1 space-y-1">
                {parseLinks(recruit.links).map((link, index) => (
                  <li key={`${link}-${index}`}>
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-amber-700 underline break-all hover:text-amber-800"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-sm text-gray-500">No links provided</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
