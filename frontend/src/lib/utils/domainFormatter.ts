/**
 * Convert URL-friendly domain format (kebab-case) to database format (Title Case)
 * Example: "logistics-and-operations" -> "Logistics and Operations"
 */
export function formatDomainFromUrl(domainParam: string): string {
  return domainParam
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
