import { RECRUITMENT_DOMAINS } from "@/lib/validators/recruitment";
import { formatDomainFromUrl } from "./domainFormatter";

/**
 * Get all valid domains in URL format (kebab-case)
 */
export function getValidUrlDomains(): string[] {
  return RECRUITMENT_DOMAINS.map((domain) =>
    domain.toLowerCase().replace(/\s+/g, "-"),
  );
}

/**
 * Check if a domain parameter is valid
 */
export function isValidDomain(domainParam: string): boolean {
  const validDomains = getValidUrlDomains();
  return validDomains.includes(domainParam.toLowerCase());
}

/**
 * Check if a domain name (title case) is valid
 */
export function isValidDomainName(domainName: string): boolean {
  return RECRUITMENT_DOMAINS.includes(
    domainName as unknown as (typeof RECRUITMENT_DOMAINS)[number],
  );
}

/**
 * Validate and format domain parameter, returns null if invalid
 */
export function validateAndFormatDomain(domainParam: string): string | null {
  if (!isValidDomain(domainParam)) {
    return null;
  }
  return formatDomainFromUrl(domainParam);
}
