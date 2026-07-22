import { getDomainNameFromSlug, getDomainSlugFromName } from "@/lib/validators/domainMap";

const LOWERCASE_WORDS = new Set(["and", "or", "the", "of"]);

export function formatDomainFromUrl(domainParam: string): string {
  const normalized = domainParam.toLowerCase();
  const mappedName = getDomainNameFromSlug(normalized);

  if (mappedName) {
    return mappedName;
  }

  return normalized
    .split("-")
    .filter(Boolean)
    .map((word, index) => {
      if (index > 0 && LOWERCASE_WORDS.has(word)) {
        return word;
      }

      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

export function formatDomainToUrl(domainName: string): string {
  const mappedSlug = getDomainSlugFromName(domainName);
  if (mappedSlug) {
    return mappedSlug;
  }

  return domainName.toLowerCase().trim().replace(/\s+/g, "-");
}
