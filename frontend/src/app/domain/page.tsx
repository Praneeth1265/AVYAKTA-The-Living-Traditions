"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RECRUITMENT_DOMAINS } from "@/lib/validators/recruitment";

export default function DomainSelectPage() {
  const [selectedDomain, setSelectedDomain] = useState("");
  const router = useRouter();

  const handleDomainSelect = () => {
    if (selectedDomain) {
      // Convert domain name to URL-friendly slug
      const domainSlug = selectedDomain.toLowerCase().replace(/\s+/g, "-");
      router.push(`/domain/${domainSlug}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
          Domain Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Select your domain to view and manage recruits
        </p>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Select Domain
          </label>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition"
          >
            <option value="">Choose a domain...</option>
            {RECRUITMENT_DOMAINS.map((domain) => (
              <option key={domain} value={domain}>
                {domain}
              </option>
            ))}
          </select>
        </div>

        <button
          onClick={handleDomainSelect}
          disabled={!selectedDomain}
          className="w-full mt-6 px-4 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition"
        >
          Access Dashboard
        </button>
      </div>
    </div>
  );
}
