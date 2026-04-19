/**
 * Convert URL-friendly domain format (kebab-case) to database format (Title Case)
 * Special words like "and" stay lowercase
 * Example: "logistics-and-operations" -> "Logistics and Operations"
 */
export function formatDomainFromUrl(domainParam: string): string {
  const lowercaseWords = ["and", "or", "the", "of"];

  return domainParam
    .split("-")
    .map((word, index) => {
      // First word is always capitalized, special words are lowercase, others are capitalized
      if (index === 0) {
        return word.charAt(0).toUpperCase() + word.slice(1);
      }
      if (lowercaseWords.includes(word.toLowerCase())) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}
