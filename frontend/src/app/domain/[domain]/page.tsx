import { notFound } from "next/navigation";
import DomainDashboardClient from "@/components/dashboard/DomainDashboardClient";
import { isValidDomain } from "@/lib/utils/domainValidator";

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domain: string }>;
}) {
  const { domain } = await params;

  if (!isValidDomain(domain)) {
    notFound();
  }

  return <DomainDashboardClient domain={domain} />;
}
