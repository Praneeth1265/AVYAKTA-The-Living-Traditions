import { RECRUITMENT_DOMAINS } from "./recruitment";

export type DomainName = (typeof RECRUITMENT_DOMAINS)[number];

export type DomainRecord = {
  name: DomainName;
  slug: string;
  emails: string[];
};

const toSlug = (value: string) => value.toLowerCase().replace(/\s+/g, "-");

export const DOMAIN_MAP: DomainRecord[] = RECRUITMENT_DOMAINS.map((name) => ({
  name,
  slug: toSlug(name),
  emails: [],
}));

export const DOMAIN_HEAD_EMAILS: Record<string, string[]> = DOMAIN_MAP.reduce(
  (accumulator, record) => {
    accumulator[record.slug] = record.emails;
    return accumulator;
  },
  {} as Record<string, string[]>,
);

export const VALID_DOMAIN_NAMES = DOMAIN_MAP.map((record) => record.name);
export const VALID_DOMAIN_SLUGS = DOMAIN_MAP.map((record) => record.slug);

export function getDomainNameFromSlug(slug: string): string | null {
  return DOMAIN_MAP.find((record) => record.slug === slug.toLowerCase())?.name ?? null;
}

export function getDomainSlugFromName(domainName: string): string | null {
  return DOMAIN_MAP.find(
    (record) => record.name.toLowerCase() === domainName.toLowerCase(),
  )?.slug ?? null;
}

export function getDomainRecordFromSlug(slug: string): DomainRecord | null {
  return DOMAIN_MAP.find((record) => record.slug === slug.toLowerCase()) ?? null;
}

export function getDomainRecordFromName(domainName: string): DomainRecord | null {
  return DOMAIN_MAP.find(
    (record) => record.name.toLowerCase() === domainName.toLowerCase(),
  ) ?? null;
}
