"use client";

import { useEffect, useState } from "react";
import IndicatorBuzzer from "./IndicatorBuzzer";
import RecruitmentCtaToggle from "./RecruitmentCtaToggle";
import { RECRUITMENT_DOMAINS } from "@/lib/validators/recruitment";

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

export default function AdminDashboardLayout() {
  const [loading, setLoading] = useState(true);
  const [counters, setCounters] = useState<CounterRow[]>([]);
  const [indicators, setIndicators] = useState<IndicatorRow[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [counterResponse, indicatorResponse] = await Promise.all([
          fetch("/api/recruitment/counter"),
          fetch("/api/recruitment/indicator"),
        ]);

        if (!counterResponse.ok || !indicatorResponse.ok) {
          throw new Error("Failed to load dashboard data");
        }

        const counterJson = await counterResponse.json();
        const indicatorJson = await indicatorResponse.json();

        setCounters(Array.isArray(counterJson.data) ? counterJson.data : []);
        setIndicators(
          Array.isArray(indicatorJson.data) ? indicatorJson.data : [],
        );
      } catch (error) {
        console.error("Error loading recruitment dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <main className="min-h-screen bg-gray-50 p-6 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100">
          <h1 className="text-3xl font-bold text-gray-900">
            Recruitment Control
          </h1>
          <p className="mt-2 text-gray-600">
            Domain recruitment counters and indicators.
          </p>
        </section>

        <RecruitmentCtaToggle />

        {loading ? (
          <section className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 text-gray-500">
            Loading dashboard...
          </section>
        ) : (
          <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {RECRUITMENT_DOMAINS.map((domain) => {
              const counter = counters.find((entry) => entry.domain === domain);
              const indicator = indicators.find(
                (entry) => entry.domain === domain,
              );

              return (
                <article
                  key={domain}
                  className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
                >
                  <div className="mb-4 flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900">
                        {domain}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {counter
                          ? counter.not_sure +
                            counter.approved +
                            counter.rejected
                          : 0}{" "}
                        applications
                      </p>
                    </div>
                    <IndicatorBuzzer
                      domain={domain}
                      initialStatus={indicator?.indicator ?? false}
                      mode="recruitment"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-center text-sm">
                    <div className="rounded-xl bg-amber-50 p-3">
                      <div className="text-lg font-bold text-amber-800">
                        {counter?.not_sure ?? 0}
                      </div>
                      <div className="text-amber-700">Pending</div>
                    </div>
                    <div className="rounded-xl bg-green-50 p-3">
                      <div className="text-lg font-bold text-green-800">
                        {counter?.approved ?? 0}
                      </div>
                      <div className="text-green-700">Approved</div>
                    </div>
                    <div className="rounded-xl bg-red-50 p-3">
                      <div className="text-lg font-bold text-red-800">
                        {counter?.rejected ?? 0}
                      </div>
                      <div className="text-red-700">Rejected</div>
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        )}
      </div>
    </main>
  );
}
