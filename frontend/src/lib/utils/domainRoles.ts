import {
  DOMAIN_HEAD_EMAILS,
  getDomainSlugFromName,
  getDomainRecordFromSlug,
  VALID_DOMAIN_SLUGS,
} from "@/lib/validators/domainMap";

export function getDomainSlugsForEmail(email: string): string[] {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return [];
  }

  return VALID_DOMAIN_SLUGS.filter((slug) =>
    (DOMAIN_HEAD_EMAILS[slug] ?? []).some(
      (candidateEmail) => candidateEmail.trim().toLowerCase() === normalizedEmail,
    ),
  );
}

export function getDomainSlugFromDisplayName(domainName: string): string | null {
  return getDomainSlugFromName(domainName);
}

export function getDomainDisplayNameFromSlug(domainSlug: string): string | null {
  return getDomainRecordFromSlug(domainSlug)?.name ?? null;
}

export function isAllowedDomainSlug(domainSlug: string): boolean {
  return Boolean(getDomainRecordFromSlug(domainSlug));
}
