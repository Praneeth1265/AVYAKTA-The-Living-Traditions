import { VALID_DOMAIN_NAMES, VALID_DOMAIN_SLUGS } from "@/lib/validators/domainMap";

export function getValidUrlDomains(): string[] {
  return [...VALID_DOMAIN_SLUGS];
}

export function getValidDomainNames(): string[] {
  return [...VALID_DOMAIN_NAMES];
}

export function isValidDomain(domainParam: string): boolean {
  return VALID_DOMAIN_SLUGS.includes(domainParam.toLowerCase());
}

export function isValidDomainName(domainName: string): boolean {
  return VALID_DOMAIN_NAMES.some(
    (candidate) => candidate.toLowerCase() === domainName.toLowerCase(),
  );
}
