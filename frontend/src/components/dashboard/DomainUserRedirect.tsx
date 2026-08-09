"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type DomainUserRedirectProps = {
  domain?: string | null;
  fallbackPath?: string;
};

export default function DomainUserRedirect({
  domain,
  fallbackPath = "/dashboard",
}: DomainUserRedirectProps) {
  const router = useRouter();

  useEffect(() => {
    if (domain) {
      router.replace(`/domain/${domain}`);
      return;
    }

    router.replace(fallbackPath);
  }, [domain, fallbackPath, router]);

  return null;
}
