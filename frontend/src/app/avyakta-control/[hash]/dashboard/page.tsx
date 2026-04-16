"use client";

import IndicatorBuzzer from "@/components/dashboard/IndicatorBuzzer";
import { RECRUITMENT_DOMAINS } from "@/lib/validators/recruitment";

export default function DashboardPage() {
  // TODO: Fetch actual indicator status from database
  const indicatorStatus: Record<string, boolean> = {
    Technical: false,
    Design: false,
    "Event Management": false,
    "Ethics and Discipline": false,
    "Media and Visibility": false,
    "Logistics and Operations": false,
    Marketing: false,
    Finance: false,
  };

  return (
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-600 mb-8">
          Control domain recruitment indicators
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {RECRUITMENT_DOMAINS.map((domain) => (
            <IndicatorBuzzer
              key={domain}
              domain={domain}
              initialStatus={indicatorStatus[domain] || false}
            />
          ))}
        </div>

        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h2 className="font-semibold text-blue-900 mb-2">Legend:</h2>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>
              🔴 <strong>Red Button:</strong> Recruitment closed. Click to open.
            </li>
            <li>
              🟢 <strong>Green Button:</strong> Recruitment open. Cannot be
              changed.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}
