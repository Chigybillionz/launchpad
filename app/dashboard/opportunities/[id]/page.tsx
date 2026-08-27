import { PageHeader } from "@/components/layout/page-header";
import { OpportunityDetailClient } from "@/components/opportunities/opportunity-detail-client";

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <PageHeader title="Opportunity Details" />
      <OpportunityDetailClient id={id} />
    </div>
  );
}
