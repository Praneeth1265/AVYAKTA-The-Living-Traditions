"use client";

import { useEffect, useState } from "react";
import { formatDomainToUrl } from "@/lib/utils/domainFormatter";

type IndicatorBuzzerProps = {
  domain: string;
  initialStatus: boolean;
  mode?: "domain" | "recruitment";
  direction?: "open" | "close";
  disabled?: boolean;
  onUpdated?: (nextStatus: boolean) => void;
};

export default function IndicatorBuzzer({
  domain,
  initialStatus,
  mode = "domain",
  direction = "open",
  disabled = false,
  onUpdated,
}: IndicatorBuzzerProps) {
  const [isActive, setIsActive] = useState(initialStatus);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setIsActive(initialStatus);
  }, [initialStatus]);

  const nextValue = direction === "close" ? false : true;
  const canToggle = direction === "close" ? isActive : !isActive;

  const handleToggle = async () => {
    if (disabled || !canToggle || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const response =
        mode === "recruitment"
          ? await fetch("/api/recruitment/indicator", {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ domain, indicator: nextValue }),
            })
          : await fetch(`/api/indicator/${formatDomainToUrl(domain)}`, {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ indicator: nextValue }),
            });

      if (!response.ok) {
        throw new Error("Failed to update indicator");
      }

      setIsActive(nextValue);
      onUpdated?.(nextValue);
    } catch (error) {
      console.error("Error updating indicator:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-amber-100 bg-white p-4 shadow-sm transition hover:shadow-md">
      <div>
        <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
          {domain}
        </p>
        <p className="text-sm text-gray-500">
          {isActive ? "Recruitment open" : "Recruitment closed"}
        </p>
      </div>

      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled || !canToggle || isSaving}
        className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white transition ${
          isActive ? "bg-green-500" : "bg-red-500"
        } ${
          disabled || !canToggle
            ? "cursor-not-allowed opacity-90"
            : isActive
              ? "hover:bg-green-600"
              : "hover:bg-red-600"
        } ${isSaving ? "opacity-75" : ""}`}
        aria-label={`${domain} indicator toggle`}
        title={direction === "close" ? "Close recruitment" : "Open recruitment"}
      >
        {isSaving ? "…" : isActive ? "✓" : "◯"}
      </button>
    </div>
  );
}
